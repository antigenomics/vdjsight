import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { UserActions } from 'models/user/user.actions';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { SamplesActions } from 'pages/dashboard/models/samples/samples.actions';
import { DashboardProjectModuleState, fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { CurrentProjectActions } from 'pages/dashboard/pages/project/models/project/project.actions';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { NotificationsService } from 'services/notifications/notifications.service';
import { withNotification } from 'utils/effects/effects-helper';

@Injectable()
export class SampleFilesEffects {

  public currentProjectLoadSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CurrentProjectActions.loadSuccess),
    map(() => SamplesActions.loadForCurrentProject())
  ));

  public loadForCurrentProject$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.loadForCurrentProject),
    withLatestFrom(this.store.select(fromDashboardProject.getCurrentProjectUUID)),
    map(([ _, currentProjectLinkUUID ]) => SamplesActions.load({ projectLinkUUID: currentProjectLinkUUID }))
  ));

  public load$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.load),
    withLatestFrom(
      this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID)),
      this.store.pipe(select(fromDashboardProject.isSamplesLoadingForCurrentProject))
    ),
    filter(([ _, currentProjectLinkUUID, isLoading ]) => currentProjectLinkUUID !== '' && !isLoading),
    map(([ _, currentProjectLinkUUID, __ ]) => SamplesActions.loadStart({ projectLinkUUID: currentProjectLinkUUID }))
  ));

  public loadStart$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.loadStart),
    switchMap(({ projectLinkUUID }) => this.samples.list(projectLinkUUID).pipe(
      withLatestFrom(this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID))),
      map(([ { samples }, currentProjectUUID ]) =>
        currentProjectUUID === projectLinkUUID ? SamplesActions.loadSuccess({ projectLinkUUID, samples }) : ApplicationActions.noop()
      ),
      catchError((error) => of(SamplesActions.loadFailed({ projectLinkUUID, error })))
    )),
    withNotification('Sample files', {
      error: { action: CurrentProjectActions.loadFailed, message: 'An error occurred while loading sample files', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public forceDelete$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.forceDelete),
    withLatestFrom(this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID))),
    mergeMap(([ action, currentProjectLinkUUID ]) => this.samples.delete(currentProjectLinkUUID, { uuid: action.entity.link.uuid, force: true }).pipe(
      map(() => SamplesActions.forceDeleteSuccess({ entity: action.entity })),
      catchError((error) => of(SamplesActions.forceDeleteFailed({ entityId: action.entity.id, error })))
    )),
    withNotification('Samples', {
      success: { action: SamplesActions.forceDeleteSuccess, message: 'Sample has been deleted', options: { timeout: 2500 } },
      error:   { action: SamplesActions.forceDeleteFailed, message: 'An error occurred while deleting the sample', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public errorDiscard$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.failedDiscard),
    filter(({ entity }) => SampleEntity.isEntityCreateFailed(entity)),
    map(({ entity }) => SamplesActions.failedDiscarded({ entity }))
  ));

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    map(() => SamplesActions.clear())
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectModuleState>,
              private readonly samples: SamplesService, private readonly notifications: NotificationsService) {}

}
