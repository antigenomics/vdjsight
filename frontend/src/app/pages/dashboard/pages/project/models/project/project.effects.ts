import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { DashboardProjectModuleState, fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { CurrentProjectActions } from 'pages/dashboard/pages/project/models/project/project.actions';
import { ProjectsService } from 'pages/dashboard/services/projects.service';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { NotificationsService } from 'services/notifications/notifications.service';
import { withNotification } from 'utils/effects/effects-helper';

@Injectable()
export class ProjectEffects {

  public select$ = createEffect(() => this.actions$.pipe(
    ofType(CurrentProjectActions.select),
    map(({ projectLinkUUID }) => CurrentProjectActions.load({ projectLinkUUID }))
  ));

  public load$ = createEffect(() => this.actions$.pipe(
    ofType(CurrentProjectActions.load),
    withLatestFrom(
      this.store.pipe(select(fromDashboardProject.isCurrentProjectLoading))
    ),
    filter(([ action, isLoading ]) => action.projectLinkUUID !== '' && !isLoading),
    map(([ { projectLinkUUID } ]) => CurrentProjectActions.loadStart({ projectLinkUUID }))
  ));

  public loadStart = createEffect(() => this.actions$.pipe(
    ofType(CurrentProjectActions.loadStart),
    mergeMap(({ projectLinkUUID }) => this.projects.info(projectLinkUUID).pipe(
      mergeMap((link) => this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID)).pipe(
        map((currentProjectUUID) => projectLinkUUID === currentProjectUUID ? CurrentProjectActions.loadSuccess({ link }) : ApplicationActions.noop())
      )),
      catchError((error) => this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID)).pipe(
        map((currentProjectUUID) => projectLinkUUID === currentProjectUUID ? CurrentProjectActions.loadFailed(error) : ApplicationActions.noop())
      ))
    )),
    withNotification('Current project', {
      error: { action: CurrentProjectActions.loadFailed, message: 'An error occurred while fetching info for the selected project', options: { timeout: 5000 } }
    }, this.notifications)
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectModuleState>,
              private readonly projects: ProjectsService, private readonly notifications: NotificationsService) {}

}
