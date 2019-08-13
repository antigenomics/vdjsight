import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { SamplesActions } from 'pages/dashboard/models/samples/samples.actions';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector:        'vs-project-sample',
  templateUrl:     './sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSampleComponent implements OnInit, OnDestroy {
  private selectedSampleUpdateSubscription: Subscription;

  public loadingStatus$ = this.store.pipe(select(fromDashboard.getSamplesLoadingStatus));
  public sample$        = this.store.pipe(select(fromDashboard.getSelectedSample));

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<DashboardModuleState>) {}

  public ngOnInit(): void {
    this.selectedSampleUpdateSubscription = this.route.params.pipe(map((p) => p.uuid)).subscribe((uuid) => {
      this.store.dispatch(SamplesActions.select({ uuid }));
    });
  }

  public close(): void {
    this.store.dispatch(ProjectsActions.toSelectedProjectHome());
  }

  public reload(): void {
    this.store.dispatch(SamplesActions.reload());
  }

  public ngOnDestroy(): void {
    this.selectedSampleUpdateSubscription.unsubscribe();
    this.store.dispatch(SamplesActions.unselect());
  }

}
