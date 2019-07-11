import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { DashboardProjectsModuleState, fromDashboardProjects } from 'pages/dashboard/pages/projects/models/dashboard-projects.state';
import { CreateEmptyProjectEntity, ProjectEntity } from 'pages/dashboard/pages/projects/models/projects/projects';
import { ProjectsActions } from 'pages/dashboard/pages/projects/models/projects/projects.actions';
import { ProjectsFooterAnimation } from 'pages/dashboard/pages/projects/projects.animations';

@Component({
  selector:        'vs-projects',
  templateUrl:     './projects.component.html',
  styleUrls:       [ './projects.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation, ProjectsFooterAnimation ]
})
export class ProjectsComponent implements OnInit {

  public readonly isLoading    = this.store.pipe(select(fromDashboardProjects.isProjectsLoading));
  public readonly isLoaded     = this.store.pipe(select(fromDashboardProjects.isProjectsLoaded));
  public readonly isLoadFailed = this.store.pipe(select(fromDashboardProjects.isProjectsLoadFailed));
  public readonly projects$    = this.store.pipe(select(fromDashboardProjects.getAllProjects));
  public readonly selected$    = this.store.pipe(select(fromDashboardProjects.getSelectedProjectOption));

  constructor(private readonly store: Store<DashboardProjectsModuleState>) {}

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
