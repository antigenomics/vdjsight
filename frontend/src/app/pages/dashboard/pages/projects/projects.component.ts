import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { CreateProjectEntity, ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';

@Component({
  selector:        'vs-projects',
  templateUrl:     './projects.component.html',
  styleUrls:       [ './projects.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation ]
})
export class ProjectsComponent {

  public readonly isLoading    = this.store.pipe(select(fromDashboard.isProjectsLoading));
  public readonly isLoaded     = this.store.pipe(select(fromDashboard.isProjectsLoaded));
  public readonly isLoadFailed = this.store.pipe(select(fromDashboard.isProjectsLoadFailed));
  public readonly projects$    = this.store.pipe(select(fromDashboard.getAllProjects));
  public readonly highlighted$ = this.store.pipe(select(fromDashboard.getHighlightedProject));

  constructor(private readonly store: Store<DashboardModuleState>) {}

  public create(): void {
    this.store.dispatch(ProjectsActions.create({
      entity:  CreateProjectEntity(),
      request: { name: 'New project', description: 'No description' }
    }));
  }

  public update(event: { project: ProjectEntity, name: string, description: string }): void {
    this.store.dispatch(ProjectsActions.update({ entity: event.project, name: event.name, description: event.description }));
  }

  public delete(project: ProjectEntity): void {
    this.store.dispatch(ProjectsActions.forceDelete({ entity: project }));
  }

  public highlight(project: ProjectEntity): void {
    this.store.dispatch(ProjectsActions.highlight({ entityId: project.id }));
  }

}
