import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { fromRoot } from 'models/root';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { CurrentProjectActions } from 'pages/dashboard/pages/project/models/project/project.actions';
import { SampleFileEntity } from 'pages/dashboard/pages/project/models/samples/samples';
import { SampleFilesActions } from 'pages/dashboard/pages/project/models/samples/samples.actions';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { UploadGlobalErrors } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.state';
import { FilesUploaderService } from 'pages/dashboard/pages/project/pages/uploads/services/files-uploader.service';
import { SampleFilesService } from 'pages/dashboard/services/sample_files/sample-files.service';
import { combineLatest } from 'rxjs';
import { filter, first, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { StringUtils } from 'utils/utils';

@Injectable()
export class UploadsEffects {

  public update$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.update),
    filter(({ check }) => check),
    mergeMap(({ entityId }) => this.store.pipe(
      select(fromDashboardProjectUploads.getUploadByID, { id: entityId }),
      first(),
      filter((entity) => UploadEntity.isEntityPending(entity)),
      map((entity) => ProjectUploadsActions.check({ entityId: entity.id }))
    ))
  ));

  public check$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.check),
    mergeMap(({ entityId }) => this.store.pipe(
      select(fromDashboardProjectUploads.getUploadByID, { id: entityId }),
      first(),
      withLatestFrom(this.store.select(fromRoot.getUserCredentials)),
      map(([ entity, user ]) => {

        const warning = (() => {
          if (entity.name === '') {
            return UploadEntity.Errors.EMPTY_NAME;
          }

          if (FilesUploaderService.AvailableExtensions.indexOf(entity.extension) === -1) {
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
      ProjectUploadsActions.remove,
      SampleFilesActions.loadSuccess,
      SampleFilesActions.forceDeleteSuccess,
      SampleFilesActions.createSuccess,
      SampleFilesActions.updateSuccess,
      CurrentProjectActions.select
    ),
    tap(() => {
      this.store.pipe(select(fromDashboardProject.getCurrentProjectInfo), first()).subscribe((projectInfo) => {
        if (projectInfo !== undefined) {
          if (projectInfo.isUploadAllowed) {
            combineLatest([
              this.store.pipe(select(fromRoot.getUserCredentials)),
              this.store.pipe(select(fromDashboardProject.getSamplesForProject, { projectLinkUUID: projectInfo.uuid })),
              this.store.pipe(select(fromDashboardProjectUploads.getNotUploadedUploadsForProject, { projectLinkUUID: projectInfo.uuid }))
            ]).pipe(first()).subscribe(([ user, samples, uploads ]) => {
              const errors: string[]   = [];
              const warnings: string[] = [];

              if (user.permissions.maxSamplesCount > 0 && (samples.length + uploads.length) > user.permissions.maxSamplesCount) {
                errors.push(UploadGlobalErrors.MAX_FILES_COUNT_LIMIT_EXCEEDED);
              }

              if (StringUtils.duplicatesExist([
                ...samples.filter((s) => SampleFileEntity.isEntityLinked(s)).map((s) => s.link.name),
                ...uploads.filter((u) => !UploadEntity.isEntityUploaded(u)).map((u) => u.name) ])
              ) {
                errors.push(UploadGlobalErrors.UPLOAD_NAME_DUPLICATE);
              }

              if (StringUtils.duplicatesExist([
                ...samples.filter((s) => SampleFileEntity.isEntityLinked(s)).map((s) => s.link.hash),
                ...uploads.filter((u) => UploadEntity.isEntityHashReady(u)).map((u) => u.hash) ])
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
    ofType(ProjectUploadsActions.startUpload),
    mergeMap(({ entityId }) => this.store.pipe(
      select(fromDashboardProjectUploads.getUploadByID, { id: entityId }),
      first(),
      filter((entity) => UploadEntity.isEntityPending(entity)),
      tap((entity) => {
        this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID), first()).subscribe((projectLinkUUID) => {
          // this.samplesAPI.create(projectLinkUUID, entity, this.uploader.fileFor(entity.id));
          console.log(`Upload attempt for ${projectLinkUUID}`, entity);
          // const [ response, progress ] = this.samplesAPI.create(projectLinkUUID, upload, this.uploader.fileFor(entityId));
          //
          // response.subscribe((r) => console.log(r));
          // progress.subscribe((p) => console.log(p));
        });
      })
    ))
  ), { dispatch: false });

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectUploadModuleState>,
              private readonly uploader: FilesUploaderService, private readonly samplesAPI: SampleFilesService) {}

}
