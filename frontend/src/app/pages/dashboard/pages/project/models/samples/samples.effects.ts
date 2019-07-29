import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { UserActions } from 'models/user/user.actions';
import { DashboardProjectModuleState, fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { CurrentProjectActions } from 'pages/dashboard/pages/project/models/project/project.actions';
import { SampleFilesActions } from 'pages/dashboard/pages/project/models/samples/samples.actions';
import { SampleFilesService } from 'pages/dashboard/services/sample_files/sample-files.service';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { NotificationsService } from 'services/notifications/notifications.service';
import { withNotification } from 'utils/effects/effects-helper';

@Injectable()
export class SampleFilesEffects {

  public load$ = createEffect(() => this.actions$.pipe(
    ofType(SampleFilesActions.load),
    withLatestFrom(
      this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID)),
      this.store.pipe(select(fromDashboardProject.isSamplesLoading))
    ),
    filter(([ _, currentProjectLinkUUID, isLoading ]) => currentProjectLinkUUID !== '' && !isLoading),
    map(([ _, currentProjectLinkUUID, __ ]) => SampleFilesActions.loadStart({ projectLinkUUID: currentProjectLinkUUID }))
  ));

  public loadStart$ = createEffect(() => this.actions$.pipe(
    ofType(SampleFilesActions.loadStart),
    switchMap(({ projectLinkUUID }) => this.samples.list(projectLinkUUID).pipe(
      withLatestFrom(this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID))),
      map(([ { samples }, currentProjectUUID ]) =>
        currentProjectUUID === projectLinkUUID ? SampleFilesActions.loadSuccess({ samples }) : ApplicationActions.noop()
      ),
      catchError((error) => this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID)).pipe(
        map((currentProjectUUID) => projectLinkUUID === currentProjectUUID ? SampleFilesActions.loadFailed(error) : ApplicationActions.noop())
      ))
    )),
    withNotification('Sample files', {
      error: { action: CurrentProjectActions.loadFailed, message: 'An error occurred while loading sample files', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public currentProjectLoadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CurrentProjectActions.loadSuccess),
    map(() => SampleFilesActions.load())
  ));

  public delete$ = createEffect(() => this.actions$.pipe(
    ofType(SampleFilesActions.forceDelete),
    withLatestFrom(this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID))),
    mergeMap(([ action, currentProjectLinkUUID ]) => this.samples.delete(currentProjectLinkUUID, { uuid: action.entity.link.uuid, force: true }).pipe(
      map(() => SampleFilesActions.forceDeleteSuccess({ entityId: action.entity.id })),
      catchError((error) => of(SampleFilesActions.forceDeleteFailed({ entityId: action.entity.id, error })))
    )),
    withNotification('Samples', {
      success: { action: SampleFilesActions.forceDeleteSuccess, message: 'Sample has been deleted', options: { timeout: 2500 } },
      error:   { action: SampleFilesActions.forceDeleteFailed, message: 'An error occurred while deleting the sample', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public clear$ = createEffect(() => this.actions$.pipe(
    ofType(
      UserActions.logout,
      CurrentProjectActions.deselect
    ),
    map(() => SampleFilesActions.clear())
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectModuleState>,
              private readonly samples: SampleFilesService, private readonly notifications: NotificationsService) {}

}
