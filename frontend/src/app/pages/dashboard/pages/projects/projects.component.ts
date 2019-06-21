import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { CreateProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'vs-projects',
  templateUrl:     './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {

  public readonly isLoading    = this.store.pipe(select(fromDashboard.isProjectsLoading));
  public readonly isLoaded     = this.store.pipe(select(fromDashboard.isProjectsLoaded));
  public readonly isLoadFailed = this.store.pipe(select(fromDashboard.isProjectsLoadFailed));
  public readonly projects$    = this.store.pipe(select(fromDashboard.getAllProjects));

  constructor(private readonly store: Store<DashboardModuleState>) {}

  public create(): void {
    this.store.dispatch(ProjectsActions.create({
      entity:  CreateProjectEntity(),
      request: { name: 'New project', description: 'No description' }
    }));
  }

}
