import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CreateClonotypesAnalysisEntity } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { Subscription } from 'rxjs';

@Component({
  selector:        'vs-sample-clonotypes',
  templateUrl:     './sample-clonotypes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public sample$     = this.store.pipe(select(fromDashboard.getSelectedSample));
  public clonotypes$ = this.store.select(fromDashboard.getClonotypesAnalysisForSelectedSample);

  constructor(private readonly store: Store<DashboardModuleState>) {}

  public ngOnInit(): void {
    this.subscription = this.sample$.subscribe((sample) => {
      if (sample && sample.link) {
        const analysis = CreateClonotypesAnalysisEntity(sample.projectLinkUUID, sample.link.uuid);
        this.store.dispatch(AnalysisActions.createIfNotExist({ sample, analysis: analysis }));
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
