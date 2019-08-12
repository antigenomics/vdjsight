import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectsListModule } from 'pages/dashboard/pages/projects/components/projects_list/projects-list.module';
import { ProjectsListPreviewModule } from 'pages/dashboard/pages/projects/components/projects_preview/projects-list-preview.module';
import { ProjectsComponent } from 'pages/dashboard/pages/projects/projects.component';

const ProjectsRouting = RouterModule.forChild([
  { path: '', component: ProjectsComponent }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectsRouting,
    ProjectsListModule, ProjectsListPreviewModule, SmoothHeightModule
  ],
  declarations: [ ProjectsComponent ],
  exports:      [ ProjectsComponent ]
})
export class ProjectsModule {}
