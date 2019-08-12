import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { UserActions } from 'models/user/user.actions';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { SamplesActions } from 'pages/dashboard/models/samples/samples.actions';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { NotificationsService } from 'services/notifications/notifications.service';
import { withNotification } from 'utils/effects/effects-helper';

@Injectable()
export class SampleFilesEffects implements OnInitEffects {

  public load$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.load),
    withLatestFrom(this.store.pipe(select(fromDashboard.getSamplesLoadingStatus))),
    filter(([ _, status ]) => !status.loaded && !status.loading),
    map(() => SamplesActions.loadStart())
  ));

  public loadStart$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.loadStart),
    switchMap(() => this.samples.list().pipe(
      map(({ samples }) => SamplesActions.loadSuccess({ samples })),
      catchError((error) => of(SamplesActions.loadFailed({ error })))
    )),
    withNotification('Samples', {
      error: { action: SamplesActions.loadFailed, message: 'An error occurred while loading samples', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public reload$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.reload),
    withLatestFrom(this.store.pipe(select(fromDashboard.getSamplesLoadingStatus))),
    filter(([ _, status ]) => !status.loading),
    map(() => SamplesActions.loadStart())
  ));

  public update$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.update),
    mergeMap((action) => this.samples.update(action.entity.projectLinkUUID, {
      uuid:     action.entity.link.uuid,
      name:     action.name,
      software: action.software,
      species:  action.species,
      gene:     action.gene
    }).pipe(
      map(({ link }) => SamplesActions.updateSuccess({ entityId: action.entity.id, link: link })),
      catchError((error) => of(SamplesActions.updateFailed({ entityId: action.entity.id, error })))
    )),
    withNotification('Samples', {
      success: { action: SamplesActions.updateSuccess, message: 'Sample has been updated', options: { timeout: 2500 } },
      error:   { action: SamplesActions.updateFailed, message: 'An error occurred while updating the sample', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public forceDelete$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.forceDelete),
    mergeMap((action) => this.samples.delete(action.entity.projectLinkUUID, { uuid: action.entity.link.uuid, force: true }).pipe(
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

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardModuleState>,
              private readonly samples: SamplesService, private readonly notifications: NotificationsService) {}

  public ngrxOnInitEffects(): Action {
    return SamplesActions.load();
  }

}
