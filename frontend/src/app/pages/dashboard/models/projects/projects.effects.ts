import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { UserActions } from 'models/user/user.actions';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { ProjectsService } from 'pages/dashboard/services/projects/projects.service';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { NotificationsService } from 'services/notifications/notifications.service';
import { withNotification } from 'utils/effects/effects-helper';

@Injectable()
export class ProjectsEffects {

  public load$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.load),
    withLatestFrom(
      this.store.pipe(select(fromDashboard.isProjectsLoaded)),
      this.store.pipe(select(fromDashboard.isProjectsLoading))
    ),
    filter(([ _, isLoaded, isLoading ]) => !isLoaded && !isLoading),
    map(() => ProjectsActions.loadStart())
  ));

  public loadStart$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.loadStart),
    switchMap(() => this.projects.list().pipe(
      map((response) => ProjectsActions.loadSuccess({ projects: response.projects })),
      catchError((error) => of(ProjectsActions.loadFailed({ error })))
    )),
    withNotification('Projects', {
      error: { action: ProjectsActions.loadFailed, message: 'An error occurred while loading projects', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public create$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.create),
    mergeMap((action) => this.projects.create(action.request).pipe(
      map((response) => ProjectsActions.createSuccess({ entityId: action.entity.id, link: response.link })),
      catchError((error) => of(ProjectsActions.createFailed({ entityId: action.entity.id, error })))
    )),
    withNotification('Projects', {
      success: { action: ProjectsActions.createSuccess, message: 'New project has been created', options: { timeout: 2500 } },
      error:   { action: ProjectsActions.createFailed, message: 'An error occurred while creating the project', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public update$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.update),
    mergeMap((action) =>
      this.projects.update({ uuid: action.entity.link.uuid, name: action.name, description: action.description }).pipe(
        map((response) => ProjectsActions.updateSuccess({ entityId: action.entity.id, link: response.link })),
        catchError((error) => of(ProjectsActions.updateFailed({ entityId: action.entity.id, error })))
      )
    ),
    withNotification('Projects', {
      success: { action: ProjectsActions.updateSuccess, message: 'Project has been updated', options: { timeout: 1500 } },
      error:   { action: ProjectsActions.updateFailed, message: 'An error occurred while updating the project', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public delete$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.forceDelete),
    mergeMap((action) => this.projects.delete({ uuid: action.entity.link.uuid, force: true }).pipe(
      map(() => ProjectsActions.forceDeleteSuccess({ entityId: action.entity.id })),
      catchError((error) => of(ProjectsActions.forceDeleteFailed({ entityId: action.entity.id, error })))
    )),
    withNotification('Projects', {
      success: { action: ProjectsActions.forceDeleteSuccess, message: 'Project has been deleted', options: { timeout: 2500 } },
      error:   { action: ProjectsActions.forceDeleteFailed, message: 'An error occurred while deleting the project', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  public deleteSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.forceDeleteSuccess),
    withLatestFrom(
      this.store.pipe(select(fromDashboard.getSelectedProjectOption))
    ),
    filter(([ action, selected ]) => selected.isDefined && action.entityId === selected.get.id),
    map(() => ProjectsActions.clearProjectSelection())
  ));

  public errorDiscard$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.failedDiscard),
    filter(({ entity }) => ProjectEntity.isEntityCreateFailed(entity)),
    map(({ entity }) => ProjectsActions.failedDiscarded({ entity }))
  ));


  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    map(() => ProjectsActions.clear())
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardModuleState>,
              private readonly projects: ProjectsService, private readonly notifications: NotificationsService) {}

}
