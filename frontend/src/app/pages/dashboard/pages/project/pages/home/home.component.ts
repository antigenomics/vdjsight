import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DashboardProjectModuleState, fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';

@Component({
  selector:        'vs-project-home',
  templateUrl:     './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectHomeComponent {
  public readonly projectInfo$ = this.store.pipe(select(fromDashboardProject.getCurrentProjectInfo));

  constructor(private readonly store: Store<DashboardProjectModuleState>) {}

}
