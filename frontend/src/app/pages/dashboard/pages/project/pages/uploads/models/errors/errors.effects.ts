import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { fromRoot } from 'models/root';
import { UserInfo } from 'models/user/user';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { CurrentProjectActions } from 'pages/dashboard/pages/project/models/project/project.actions';
import { SampleFilesActions } from 'pages/dashboard/pages/project/models/samples/samples.actions';
import { ProjectUploadErrorsActions } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors.actions';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { FilesUploaderService } from 'pages/dashboard/pages/project/pages/uploads/services/files-uploader.service';
import { combineLatest } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { StringUtils } from 'utils/utils';

export const enum UploadEntityErrors {
  EMPTY_NAME                   = 'Empty name is not allowed',
  INVALID_EXTENSION            = 'Invalid file extension',
  MAX_FILE_SIZE_LIMIT_EXCEEDED = 'Max file size limit has been exceeded'
}

export const enum UploadGlobalErrors {
  UPLOAD_NOT_ALLOWED             = 'You are not allowed to upload samples in this project',
  MAX_FILES_COUNT_LIMIT_EXCEEDED = 'Max files count limit has been exceeded',
  UPLOAD_HASH_DUPLICATE          = 'You probably have a duplicate samples in the upload list',
  UPLOAD_NAME_DUPLICATE          = 'Duplicate names are not allowed'
}

@Injectable()
export class ErrorsEffects {

  public check$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.check),
    mergeMap((check) => {
      return combineLatest([
        this.store.pipe(select(fromRoot.getUserCredentials)),
        this.store.pipe(select(fromDashboardProjectUploads.getUploadByID, { id: check.entityId })),
        this.store.pipe(select(fromDashboardProjectUploads.getErrorsForUploadEntity, { uploadId: check.entityId }))
      ]).pipe(take(1), map(([ user, uploadEntity, errorEntity ]) => {
          const error = ErrorsEffects.getUploadEntityErrors(user, uploadEntity);
          this.store.dispatch(ProjectUploadErrorsActions.update({ errorId: errorEntity.id, error: error }));
          return ProjectUploadErrorsActions.checkGlobal();
        })
      );
    })
  ));

  public global$ = createEffect(() => this.actions$.pipe(
    ofType(
      ProjectUploadErrorsActions.checkGlobal,
      ProjectUploadsActions.add,
      ProjectUploadsActions.remove,
      SampleFilesActions.loadSuccess,
      SampleFilesActions.forceDeleteSuccess,
      SampleFilesActions.createSuccess,
      SampleFilesActions.updateSuccess,
      CurrentProjectActions.select
    ),
    tap(() => this.handleGlobalErrors())
  ), { dispatch: false });

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectUploadModuleState>) {}

  private handleGlobalErrors(): void {
    this.store.pipe(select(fromDashboardProject.getCurrentProjectInfo), take(1)).subscribe((projectInfo) => {
      if (projectInfo !== undefined) {

        if (projectInfo.isUploadAllowed) {

          combineLatest([
            this.store.pipe(select(fromRoot.getUserCredentials)),
            this.store.pipe(select(fromDashboardProject.getSamplesForProject, { projectLinkUUID: projectInfo.uuid })),
            this.store.pipe(select(fromDashboardProjectUploads.getUploadsForProject, { projectLinkUUID: projectInfo.uuid }))
          ]).pipe(take(1)).subscribe(([ user, samples, uploads ]) => {
            const errors: string[]   = [];
            const warnings: string[] = [];

            if (user.permissions.maxSamplesCount > 0 && (samples.length + uploads.length) > user.permissions.maxSamplesCount) {
              errors.push(UploadGlobalErrors.MAX_FILES_COUNT_LIMIT_EXCEEDED);
            }

            if (StringUtils.duplicatesExist([
              ...samples.filter((s) => s.link !== undefined).map((s) => s.link.name),
              ...uploads.filter((u) => !u.uploaded).map((u) => u.name) ])
            ) {
              errors.push(UploadGlobalErrors.UPLOAD_NAME_DUPLICATE);
            }

            if (StringUtils.duplicatesExist([
              ...samples.filter((s) => s.link !== undefined).map((s) => s.link.hash),
              ...uploads.filter((u) => u.hash !== undefined).map((u) => u.hash) ])
            ) {
              warnings.push(UploadGlobalErrors.UPLOAD_HASH_DUPLICATE);
            }


            this.store.dispatch(ProjectUploadErrorsActions.global({ errors, warnings }));
          });

        } else {
          this.store.dispatch(ProjectUploadErrorsActions.global({
            errors: [ UploadGlobalErrors.UPLOAD_NOT_ALLOWED ], warnings: []
          }));
        }
      }
    });
  }

  private static getUploadEntityErrors(user: UserInfo, upload: UploadEntity): string | undefined {

    if (upload.name === '') {
      return UploadEntityErrors.EMPTY_NAME;
    }

    if (FilesUploaderService.AvailableExtensions.indexOf(upload.extension) === -1) {
      return UploadEntityErrors.INVALID_EXTENSION;
    }

    if (user.permissions.maxSampleSize > 0 && upload.size > user.permissions.maxSampleSize) {
      return UploadEntityErrors.MAX_FILE_SIZE_LIMIT_EXCEEDED;
    }

    return undefined;
  }

}
