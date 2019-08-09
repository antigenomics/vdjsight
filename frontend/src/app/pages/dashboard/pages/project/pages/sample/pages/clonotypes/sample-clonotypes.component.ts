import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { DashboardSampleModuleState, fromDashboardSample } from 'pages/dashboard/pages/project/pages/sample/models/dashboard-sample.state';
import { AnalysisService } from 'pages/dashboard/services/analysis/analysis.service';
import { combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector:        'vs-sample-clonotypes',
  templateUrl:     './sample-clonotypes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesComponent {

  constructor(private readonly store: Store<DashboardSampleModuleState>, private readonly analysis: AnalysisService) {}

  public test(): void {
    combineLatest([
      this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID)),
      this.store.pipe(select(fromDashboardSample.getCurrentSampleUUID))
    ]).pipe(first()).subscribe(([ pUUID, sUUID ]) => {
      this.analysis.clonotypes(pUUID, sUUID, { page: 2000, pageSize: 10 }).pipe(first()).subscribe((response) => {
        console.log(response);
      });
    });
  }

}
