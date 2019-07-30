import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DashboardSampleModuleState, fromDashboardSample } from 'pages/dashboard/pages/project/pages/sample/models/dashboard-sample.state';

@Component({
  selector:        'vs-sample-home',
  templateUrl:     './sample-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleHomeComponent {

  public sample$ = this.store.pipe(select(fromDashboardSample.getCurrentSampleEntity));

  constructor(private readonly store: Store<DashboardSampleModuleState>) {}

}
