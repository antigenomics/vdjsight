import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { fromRoot } from 'models/root';
import { ProjectUploadErrorsActions } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors.actions';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { combineLatest } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

export const enum UploadEntityNameErrors {
  EMPTY_NAME = 'Empty name is not allowed'
}

@Injectable()
export class ErrorsEffects {

  public update$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.update),
    mergeMap((update) => {
      return combineLatest([
        this.store.pipe(select(fromRoot.getUserCredentials)),
        this.store.pipe(select(fromDashboardProjectUploads.getUploadByID, { id: update.entityId })),
        this.store.pipe(select(fromDashboardProjectUploads.getErrorsForUploadEntity, { uploadId: update.entityId }))
      ]).pipe(take(1), map(([ _, current, errors ]) => {
          // TODO check for errors here
          // const permissions = user.permissions;
          const e: string[] = [];

          e.push(...ErrorsEffects.handleUploadEntityNameErrors(current));

          return ProjectUploadErrorsActions.update({ errorId: errors.id, errors: e });
        })
      );
    })
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectUploadModuleState>) {}

  private static handleUploadEntityNameErrors(entity: UploadEntity): string[] {
    if (entity.name === '') {
      return [ UploadEntityNameErrors.EMPTY_NAME ];
    }
    return [];
  }

}
