import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { DashboardProjectModuleState } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { ContentAnimation, SidebarAnimation } from 'pages/dashboard/pages/project/project.animations';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector:        'vs-project-page',
  templateUrl:     './project.component.html',
  styleUrls:       [ './project.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SidebarAnimation, ContentAnimation ]
})
export class ProjectComponent implements OnInit, OnDestroy {
  private currentProjectUpdateSubscription: Subscription;

  public readonly loadingStatus$ = this.store.pipe(select(fromDashboard.getProjectsLoadingStatus));

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<DashboardProjectModuleState>) {}

  public ngOnInit(): void {
    this.currentProjectUpdateSubscription = this.route.params.pipe(map((p) => p.uuid)).subscribe((uuid) => {
      this.store.dispatch(ProjectsActions.select({ uuid }));
    });
  }

  public reload(): void {
    this.store.dispatch(ProjectsActions.reload());
  }

  public ngOnDestroy(): void {
    this.currentProjectUpdateSubscription.unsubscribe();
    this.store.dispatch(ProjectsActions.unselect());
  }

}
