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

  public readonly loadingStatus$ = this.store.pipe(select(fromDashboard.getProjectsLoadingStatus));
  public readonly projects$      = this.store.pipe(select(fromDashboard.getAllProjects));
  public readonly preview$       = this.store.pipe(select(fromDashboard.getPreviewingProject));

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

  public discard(project: ProjectEntity): void {
    this.store.dispatch(ProjectsActions.failedDiscard({ entity: project }));
  }

  public preview(project: ProjectEntity): void {
    this.store.dispatch(ProjectsActions.previewProject({ entityId: project.id }));
  }

  public clearPreview(): void {
    this.store.dispatch(ProjectsActions.clearProjectPreview());
  }

  public reload(): void {
    this.store.dispatch(ProjectsActions.load());
  }

}
