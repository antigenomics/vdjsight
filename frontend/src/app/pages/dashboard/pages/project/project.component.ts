import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { CurrentProjectActions } from 'pages/dashboard/pages/project/models/project/project.actions';
import { ContentAnimation, ExtraAnimation, SidebarAnimation } from 'pages/dashboard/pages/project/project.animations';
import { DashboardProjectsModuleState } from 'pages/dashboard/pages/projects/models/dashboard-projects.state';
import { Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector:        'vs-project-page',
  templateUrl:     './project.component.html',
  styleUrls:       [ './project.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SidebarAnimation, ContentAnimation, ExtraAnimation ]
})
export class ProjectComponent implements OnInit, OnDestroy {
  private currentProjectUpdateSubscription: Subscription;

  public readonly isCurrentProjectLoading$    = this.store.pipe(select(fromDashboardProject.isCurrentProjectLoading));
  public readonly isCurrentProjectLoaded$     = this.store.pipe(select(fromDashboardProject.isCurrentProjectLoaded));
  public readonly isCurrentProjectLoadFailed$ = this.store.pipe(select(fromDashboardProject.isCurrentProjectLoadFailed));

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<DashboardProjectsModuleState>) {}

  public ngOnInit(): void {
    this.currentProjectUpdateSubscription = this.route.params.pipe(map((p) => p.uuid)).subscribe((uuid) => {
      this.store.dispatch(CurrentProjectActions.select({ projectLinkUUID: uuid }));
    });
  }

  public reload(): void {
    this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID), first()).subscribe((uuid) => {
      this.store.dispatch(CurrentProjectActions.load({ projectLinkUUID: uuid }));
    });
  }

  public ngOnDestroy(): void {
    this.currentProjectUpdateSubscription.unsubscribe();
    this.store.dispatch(CurrentProjectActions.deselect());
  }

}
