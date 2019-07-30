import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { CreateEmptyProjectEntity, ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { ProjectsFooterAnimation } from 'pages/dashboard/pages/projects/projects.animations';

@Component({
  selector:        'vs-projects',
  templateUrl:     './projects.component.html',
  styleUrls:       [ './projects.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation, ProjectsFooterAnimation ]
})
export class ProjectsComponent implements OnInit {

  public readonly isLoading    = this.store.pipe(select(fromDashboard.isProjectsLoading));
  public readonly isLoaded     = this.store.pipe(select(fromDashboard.isProjectsLoaded));
  public readonly isLoadFailed = this.store.pipe(select(fromDashboard.isProjectsLoadFailed));
  public readonly projects$    = this.store.pipe(select(fromDashboard.getAllProjects));
  public readonly selected$    = this.store.pipe(select(fromDashboard.getSelectedProjectOption));

  constructor(private readonly store: Store<DashboardModuleState>) {}

  public ngOnInit(): void {
    this.store.dispatch(ProjectsActions.load());
  }

  public create(): void {
    this.store.dispatch(ProjectsActions.create({
      entity:  CreateEmptyProjectEntity(),
      request: { name: 'New project', description: 'No description' }
    }));
  }

  public update(event: { project: ProjectEntity, name: string, description: string }): void {
    this.store.dispatch(ProjectsActions.update({ entity: event.project, name: event.name, description: event.description }));
  }

  public delete(project: ProjectEntity): void {
    this.store.dispatch(ProjectsActions.forceDelete({ entity: project }));
  }

  public select(project: ProjectEntity): void {
    this.store.dispatch(ProjectsActions.selectProject({ entityId: project.id }));
  }

  public deselect(): void {
    this.store.dispatch(ProjectsActions.clearProjectSelection());
  }

  public reload(): void {
    this.store.dispatch(ProjectsActions.load());
  }

}
