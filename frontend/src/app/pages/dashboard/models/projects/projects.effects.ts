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
      map((response) => ProjectsActions.createSuccess({ entity: action.entity, link: response.link })),
      catchError((error) => of(ProjectsActions.createFailed({ entity: action.entity, error })))
    ))
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardModuleState>,
              private readonly projects: ProjectsService) {}

  public ngrxOnInitEffects(): Action {
    return ProjectsActions.load();
  }

}
