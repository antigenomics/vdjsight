import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnalysisClonotypesEntity } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { DashboardModuleState } from 'pages/dashboard/models/dashboard.state';

@Component({
  selector:        'vs-sample-clonotypes-table-filters',
  templateUrl:     './sample-clonotypes-table-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTableFiltersComponent {
  @Input()
  public clonotypes: AnalysisClonotypesEntity;

  constructor(private readonly store: Store<DashboardModuleState>) {}

  public selectGeneFilter(gene: string, value: string): void {
    this.store.dispatch(AnalysisActions.clonotypesChangeOptions({
      analysisId:     this.clonotypes.id,
      options:        {
        vFilters: gene === 'V' ? [ ...this.clonotypes.options.vFilters, value ] : this.clonotypes.options.vFilters,
        dFilters: gene === 'D' ? [ ...this.clonotypes.options.dFilters, value ] : this.clonotypes.options.dFilters,
        jFilters: gene === 'J' ? [ ...this.clonotypes.options.jFilters, value ] : this.clonotypes.options.jFilters
      }, forceUpdate: false
    }));
  }

  public removeGeneFilter(gene: string, value: string): void {
    this.store.dispatch(AnalysisActions.clonotypesChangeOptions({
      analysisId:  this.clonotypes.id,
      options:     {
        vFilters: gene === 'V' ? this.clonotypes.options.vFilters.filter((v) => v !== value) : this.clonotypes.options.vFilters,
        dFilters: gene === 'D' ? this.clonotypes.options.dFilters.filter((d) => d !== value) : this.clonotypes.options.dFilters,
        jFilters: gene === 'J' ? this.clonotypes.options.jFilters.filter((j) => j !== value) : this.clonotypes.options.jFilters
      },
      forceUpdate: false
    }));
  }
}
