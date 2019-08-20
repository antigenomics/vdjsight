import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnalysisClonotypesEntity } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { DashboardModuleState } from 'pages/dashboard/models/dashboard.state';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';

@Component({
  selector:        'vs-sample-clonotypes-wrapper',
  templateUrl:     './sample-clonotypes-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesWrapperComponent {
  @Input()
  public sample: SampleEntity;

  @Input()
  public clonotypes: AnalysisClonotypesEntity;


  constructor(private readonly store: Store<DashboardModuleState>) {}

  public filter(): void {
    this.page(1);
  }

  public test_sort(): void {
    this.store.dispatch(AnalysisActions.clonotypesChangeOptions({ analysisId: this.clonotypes.id, options: { sort: 'cdr3aa:asc' }, forceUpdate: true }));
  }

  public page(p: number): void {
    this.store.dispatch(AnalysisActions.clonotypesSelectPage({ analysisId: this.clonotypes.id, page: p }));
  }
}
