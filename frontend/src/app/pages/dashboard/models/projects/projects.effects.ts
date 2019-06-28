import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { ProjectsService } from 'pages/dashboard/services/projects.service';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class ProjectsEffects implements OnInitEffects {

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
    mergeMap(() => this.projects.list().pipe(
      map((response) => ProjectsActions.loadSuccess({ projects: response.projects })),
      catchError((error) => of(ProjectsActions.loadFailed({ error })))
    ))
  ));

  public create$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.create),
    mergeMap((action) => this.projects.create(action.request).pipe(
      map((response) => ProjectsActions.createSuccess({ entityId: action.entity.id, link: response.link })),
      catchError((error) => of(ProjectsActions.createFailed({ entityId: action.entity.id, error })))
    ))
  ));

  public update$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.update),
    mergeMap((action) =>
      this.projects.update({ uuid: action.entity.link.uuid, name: action.name, description: action.description }).pipe(
        map((response) => ProjectsActions.updateSuccess({ entityId: action.entity.id, link: response.link })),
        catchError((error) => of(ProjectsActions.updateFailed({ entityId: action.entity.id, error })))
      ))
  ));

  public delete$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.forceDelete),
    mergeMap((action) => this.projects.delete({ uuid: action.entity.link.uuid, force: true }).pipe(
      map(() => ProjectsActions.forceDeleteSuccess({ entityId: action.entity.id })),
      catchError((error) => of(ProjectsActions.forceDeleteFailed({ entityId: action.entity.id, error })))
    ))
  ));

  public deleteSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.forceDeleteSuccess),
    withLatestFrom(
      this.store.pipe(select(fromDashboard.getSelectedProjectOption))
    ),
    filter(([ action, selected ]) => selected.isDefined && action.entityId === selected.get.id),
    map(() => ProjectsActions.clearProjectSelection())
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardModuleState>,
              private readonly projects: ProjectsService) {}

  public ngrxOnInitEffects(): Action {
    return ProjectsActions.load();
  }

}
