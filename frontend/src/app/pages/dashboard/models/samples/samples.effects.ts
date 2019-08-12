import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from 'models/user/user.actions';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { SamplesActions } from 'pages/dashboard/models/samples/samples.actions';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class SampleFilesEffects {

  // public currentProjectLoadSuccess$ = createEffect(() => this.actions$.pipe(
  //   ofType(CurrentProjectActions.loadSuccess),
  //   map(() => SamplesActions.loadForCurrentProject())
  // ));
  //
  // public loadForCurrentProject$ = createEffect(() => this.actions$.pipe(
  //   ofType(SamplesActions.loadForCurrentProject),
  //   withLatestFrom(this.store.select(fromDashboardProject.getCurrentProjectUUID)),
  //   map(([ _, currentProjectLinkUUID ]) => SamplesActions.load({ projectLinkUUID: currentProjectLinkUUID }))
  // ));
  //
  // public load$ = createEffect(() => this.actions$.pipe(
  //   ofType(SamplesActions.load),
  //   withLatestFrom(
  //     this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID)),
  //     this.store.pipe(select(fromDashboardProject.isSamplesLoadingForCurrentProject))
  //   ),
  //   filter(([ _, currentProjectLinkUUID, isLoading ]) => currentProjectLinkUUID !== '' && !isLoading),
  //   map(([ _, currentProjectLinkUUID, __ ]) => SamplesActions.loadStart({ projectLinkUUID: currentProjectLinkUUID }))
  // ));
  //
  // public loadStart$ = createEffect(() => this.actions$.pipe(
  //   ofType(SamplesActions.loadStart),
  //   switchMap(({ projectLinkUUID }) => this.samples.list(projectLinkUUID).pipe(
  //     withLatestFrom(this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID))),
  //     map(([ { samples }, currentProjectUUID ]) =>
  //       currentProjectUUID === projectLinkUUID ? SamplesActions.loadSuccess({ projectLinkUUID, samples }) : ApplicationActions.noop()
  //     ),
  //     catchError((error) => of(SamplesActions.loadFailed({ projectLinkUUID, error })))
  //   )),
  //   withNotification('Sample files', {
  //     error: { action: CurrentProjectActions.loadFailed, message: 'An error occurred while loading sample files', options: { timeout: 5000 } }
  //   }, this.notifications)
  // ));
  //
  // public update$ = createEffect(() => this.actions$.pipe(
  //   ofType(SamplesActions.update),
  //   withLatestFrom(this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID))),
  //   mergeMap(([ action, currentProjectLinkUUID ]) => this.samples.update(currentProjectLinkUUID, {
  //     uuid:     action.entity.link.uuid,
  //     name:     action.name,
  //     software: action.software,
  //     species:  action.species,
  //     gene:     action.gene
  //   }).pipe(
  //     map(({ link }) => SamplesActions.updateSuccess({ entityId: action.entity.id, link: link })),
  //     catchError((error) => of(SamplesActions.updateFailed({ entityId: action.entity.id, error })))
  //   )),
  //   withNotification('Samples', {
  //     success: { action: SamplesActions.updateSuccess, message: 'Sample has been updated', options: { timeout: 2500 } },
  //     error:   { action: SamplesActions.updateFailed, message: 'An error occurred while updating the sample', options: { timeout: 5000 } }
  //   }, this.notifications)
  // ));
  //
  // public forceDelete$ = createEffect(() => this.actions$.pipe(
  //   ofType(SamplesActions.forceDelete),
  //   withLatestFrom(this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID))),
  //   mergeMap(([ action, currentProjectLinkUUID ]) => this.samples.delete(currentProjectLinkUUID, { uuid: action.entity.link.uuid, force: true }).pipe(
  //     map(() => SamplesActions.forceDeleteSuccess({ entity: action.entity })),
  //     catchError((error) => of(SamplesActions.forceDeleteFailed({ entityId: action.entity.id, error })))
  //   )),
  //   withNotification('Samples', {
  //     success: { action: SamplesActions.forceDeleteSuccess, message: 'Sample has been deleted', options: { timeout: 2500 } },
  //     error:   { action: SamplesActions.forceDeleteFailed, message: 'An error occurred while deleting the sample', options: { timeout: 5000 } }
  //   }, this.notifications)
  // ));

  public errorDiscard$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.failedDiscard),
    filter(({ entity }) => SampleEntity.isEntityCreateFailed(entity)),
    map(({ entity }) => SamplesActions.failedDiscarded({ entity }))
  ));

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    map(() => SamplesActions.clear())
  ));

  // constructor(private readonly actions$: Actions, private readonly store: Store<DashboardModuleState>,
  //             private readonly samples: SamplesService, private readonly notifications: NotificationsService) {}

  constructor(private readonly actions$: Actions) {}

}
