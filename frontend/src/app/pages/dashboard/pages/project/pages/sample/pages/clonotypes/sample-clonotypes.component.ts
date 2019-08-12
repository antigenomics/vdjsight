import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { AnalysisService } from 'pages/dashboard/services/analysis/analysis.service';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector:        'vs-sample-clonotypes',
  templateUrl:     './sample-clonotypes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesComponent {

  constructor(private readonly store: Store<DashboardModuleState>, private readonly analysis: AnalysisService) {}

  public test(): void {
    combineLatest([
      this.store.pipe(select(fromDashboard.getSelectedProjectUUID)),
      this.store.pipe(select(fromDashboard.getSelectedSampleUUID))
    ]).pipe(first()).subscribe(([ pUUID, sUUID ]) => {
      this.analysis.clonotypes(pUUID, sUUID, { page: 1, pageSize: 25, pagesRegion: 2 }).pipe(first()).subscribe((response) => {
        console.log(response);
      });
    });
  }

}
