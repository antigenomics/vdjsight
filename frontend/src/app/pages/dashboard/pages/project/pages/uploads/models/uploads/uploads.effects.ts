import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { fromRoot } from 'models/root';
import { fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { CreateEmptySampleFileEntity, SampleEntity } from 'pages/dashboard/models/samples/samples';
import { SamplesActions } from 'pages/dashboard/models/samples/samples.actions';
import { DashboardProjectUploadModuleState, fromDashboardUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { UploadGlobalErrors } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.state';
import { UploadsService } from 'pages/dashboard/pages/project/pages/uploads/services/uploads.service';
import { SamplesAPI } from 'pages/dashboard/services/samples/samples-api';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';
import { combineLatest } from 'rxjs';
import { filter, first, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { BackendErrorResponse } from 'services/backend/backend-response';
import { NotificationsService } from 'services/notifications/notifications.service';
import { ArrayUtils, StringUtils } from 'utils/utils';

@Injectable()
export class UploadsEffects {

  public update$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.update),
    filter(({ check }) => check),
    mergeMap(({ entityId }) => this.store.pipe(
      select(fromDashboardUploads.getUploadByID, { id: entityId }),
      first(),
      filter((entity) => UploadEntity.isEntityPending(entity)),
      map((entity) => ProjectUploadsActions.check({ entityId: entity.id }))
    ))
  ));

  public check$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.check),
    mergeMap(({ entityId }) => this.store.pipe(
      select(fromDashboardUploads.getUploadByID, { id: entityId }),
      first(),
      withLatestFrom(this.store.select(fromRoot.getUserCredentials)),
      map(([ entity, user ]) => {

        const warning = (() => {
          if (entity.name === '') {
            return UploadEntity.Errors.EMPTY_NAME;
          }

          if (UploadsService.AvailableExtensions.indexOf(entity.extension) === -1) {
            return UploadEntity.Errors.INVALID_EXTENSION;
          }

          if (user.permissions.maxSampleSize > 0 && entity.size > user.permissions.maxSampleSize) {
            return UploadEntity.Errors.MAX_FILE_SIZE_LIMIT_EXCEEDED;
          }

          return undefined;
        })();

        return ProjectUploadsActions.checked({ entityId: entity.id, warning });
      })
    ))
  ));

  public global$ = createEffect(() => this.actions$.pipe(
    ofType(
      ProjectUploadsActions.add,
      ProjectUploadsActions.checked,
      ProjectUploadsActions.uploadSuccess,
      ProjectUploadsActions.uploadFailed,
      ProjectUploadsActions.remove,
      SamplesActions.loadSuccess,
      SamplesActions.forceDeleteSuccess,
      SamplesActions.updateSuccess,
      ProjectsActions.select
    ),
    tap(() => {
      this.store.pipe(select(fromDashboard.getSelectedProjectInfo), first()).subscribe((projectInfo) => {
        if (projectInfo !== undefined) {
          if (projectInfo.isUploadAllowed) {
            combineLatest([
              this.store.pipe(select(fromRoot.getUserCredentials)),
              this.store.pipe(select(fromDashboard.getSamplesForProject, { projectLinkUUID: projectInfo.uuid })),
              this.store.pipe(select(fromDashboardUploads.getNotUploadedUploadsForProject, { projectLinkUUID: projectInfo.uuid }))
            ]).pipe(first()).subscribe(([ user, samples, uploads ]) => {
              const errors: string[]   = [];
              const warnings: string[] = [];

              const pendingCount =
                      samples.filter((s) => !SampleEntity.isEntityCreateFailed(s)).length +
                      uploads.filter((u) => !UploadEntity.isEntityWithError(u)).length;

              if (user.permissions.maxSamplesCount > 0 && pendingCount > user.permissions.maxSamplesCount) {
                errors.push(UploadGlobalErrors.MAX_FILES_COUNT_LIMIT_EXCEEDED);
              }

              if (StringUtils.duplicatesExist([
                ...samples.filter((s) => SampleEntity.isEntityLinked(s)).map((s) => s.link.name),
                ...uploads.filter((u) => !UploadEntity.isEntityUploaded(u) && !UploadEntity.isEntityWithError(u)).map((u) => u.name) ])
              ) {
                errors.push(UploadGlobalErrors.UPLOAD_NAME_DUPLICATE);
              }

              if (StringUtils.duplicatesExist([
                ...ArrayUtils.distinct(samples.filter((s) => SampleEntity.isEntityLinked(s)).map((s) => s.link.hash)),
                ...uploads.filter((u) => UploadEntity.isEntityHashReady(u) && !UploadEntity.isEntityWithError(u)).map((u) => u.hash) ])
              ) {
                warnings.push(UploadGlobalErrors.UPLOAD_HASH_DUPLICATE);
              }


              this.store.dispatch(ProjectUploadsActions.globalChecked({ errors, warnings }));
            });

          } else {
            this.store.dispatch(ProjectUploadsActions.globalChecked({
              errors: [ UploadGlobalErrors.UPLOAD_NOT_ALLOWED ], warnings: []
            }));
          }
        }
      });
    })
  ), { dispatch: false });

  public upload$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.upload),
    mergeMap(({ entityId }) => this.store.pipe(
      select(fromDashboardUploads.getUploadByID, { id: entityId }),
      first(),
      filter((entity) => UploadEntity.isEntityPending(entity)),
      map(() => ProjectUploadsActions.uploadStart({ entityId }))
    ))
  ));

  public uploadStart$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.uploadStart),
    mergeMap(({ entityId }) => this.store.pipe(
      select(fromDashboardUploads.getUploadByID, { id: entityId }),
      first(),
      tap((entity) => {
        this.store.pipe(select(fromDashboard.getSelectedProjectUUID), first()).subscribe((selectedProjectLinkUUID) => {

          const sample: SampleEntity              = CreateEmptySampleFileEntity(selectedProjectLinkUUID);
          const request: SamplesAPI.CreateRequest = {
            name:      entity.name,
            software:  entity.software,
            species:   entity.species,
            gene:      entity.gene,
            extension: entity.extension,
            size:      entity.size,
            hash:      entity.hash
          };

          this.samplesAPI.create(selectedProjectLinkUUID, request, this.uploads.fileFor(entity.id)).subscribe((event) => {

            switch (event.type) {
              case HttpEventType.Sent:
                this.store.dispatch(SamplesActions.create({ entity: sample, request: request }));
                this.store.dispatch(ProjectUploadsActions.linkWithSample({ entityId: entity.id, sampleId: sample.id }));
                break;
              case HttpEventType.UploadProgress:
                this.store.dispatch(ProjectUploadsActions.uploadProgress({ entityId: entityId, progress: event.loaded / event.total }));
                break;
              case HttpEventType.Response:
                this.store.dispatch(SamplesActions.createSuccess({ entityId: sample.id, link: event.body.data.link }));
                this.store.dispatch(ProjectUploadsActions.uploadSuccess({ entityId: entityId }));
                break;
              default:
            }

          }, (error: BackendErrorResponse) => {
            this.store.dispatch(SamplesActions.createFailed({ entityId: sample.id, error: error }));
            this.store.dispatch(ProjectUploadsActions.uploadFailed({ entityId: entityId, error: error }));
          });
        });
      })
    ))
  ), { dispatch: false });

  public uploadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.uploadSuccess),
    mergeMap(({ entityId }) => this.store.pipe(select(fromDashboardUploads.getUploadByID, { id: entityId })).pipe(
      first(),
      tap((upload) => {
        this.notifications.success('Uploads', `${upload.name} has been uploaded successfully`, { timeout: 2500 });
      })
    ))
  ), { dispatch: false });

  public uploadFailed$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.uploadFailed),
    mergeMap(({ entityId }) => this.store.pipe(select(fromDashboardUploads.getUploadByID, { id: entityId })).pipe(
      first(),
      tap((upload) => {
        this.notifications.error('Uploads', `An error occurred while uploading ${upload.name}`, { timeout: 5000 });
      })
    ))
  ), { dispatch: false });

  public failedDiscarded$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.failedDiscarded),
    mergeMap(({ entity }) => {
      return this.store.pipe(select(fromDashboardUploads.getUploadBySampleID, { sampleId: entity.id }), first(), map((upload) => {
        return upload !== undefined ? ProjectUploadsActions.remove({ entityId: upload.id }) : ApplicationActions.noop();
      }));
    })
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectUploadModuleState>,
              private readonly samplesAPI: SamplesService, private readonly uploads: UploadsService,
              private readonly notifications: NotificationsService) {}

}
