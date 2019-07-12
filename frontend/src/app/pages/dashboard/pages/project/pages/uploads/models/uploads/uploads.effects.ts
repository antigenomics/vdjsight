import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ProjectUploadErrorsActions } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors.actions';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { filter, map, mergeMap, take } from 'rxjs/operators';

@Injectable()
export class UploadsEffects {

  public add$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.add),
    map(({ entityId }) => ProjectUploadErrorsActions.add({ uploadId: entityId }))
  ));

  public remove$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectUploadsActions.remove),
    mergeMap(({ entityId }) =>
      this.store.pipe(
        select(fromDashboardProjectUploads.getErrorsForUploadEntity, { uploadId: entityId }),
        filter((error) => error !== undefined),
        take(1),
        map((error) => ProjectUploadErrorsActions.remove({ errorId: error.id }))
      )
    )
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectUploadModuleState>) {}

}
