import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AnalysisType } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

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
      this.store.dispatch(AnalysisActions.createIfNotExist({ sample, analysisType: AnalysisType.CLONOTYPES }));
    });
  }

  public filter(): void {
    this.page(1);
  }

  public page(p: number): void {
    this.clonotypes$.pipe(first()).subscribe((analysis) => {
      this.store.dispatch(AnalysisActions.clonotypesSelectPage({ analysis, page: p, pageSize: 10, pagesRegion: 5 }));
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
