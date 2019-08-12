import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';

@Component({
  selector:        'vs-project-home',
  templateUrl:     './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectHomeComponent {
  public readonly selected$ = this.store.pipe(select(fromDashboard.getSelectedProject));

  constructor(private readonly store: Store<DashboardModuleState>) {}

}
