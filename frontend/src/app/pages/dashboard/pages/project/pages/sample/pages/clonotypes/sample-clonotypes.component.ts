import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AnalysisType } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { first } from 'rxjs/operators';

@Component({
  selector:        'vs-sample-clonotypes',
  templateUrl:     './sample-clonotypes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesComponent implements OnInit {

  public clonotypes$ = this.store.select(fromDashboard.getClonotypesAnalysisForSelectedSample);

  constructor(private readonly store: Store<DashboardModuleState>) {}

  public ngOnInit(): void {
    this.store.pipe(select(fromDashboard.getSelectedSample)).pipe(first()).subscribe((sample) => {
      this.store.dispatch(AnalysisActions.createIfNotExist({ sample, analysisType: AnalysisType.CLONOTYPES }));
    });
  }

  public test(): void {
    this.store.select(fromDashboard.getClonotypesAnalysisForSelectedSample).pipe(first()).subscribe((analysis) => {
      this.store.dispatch(AnalysisActions.clonotypes({ analysis, page: 1, pageSize: 10, pagesRegion: 5 }));
    });
  }

}
