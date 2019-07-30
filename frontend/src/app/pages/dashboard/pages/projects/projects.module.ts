import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectsListModule } from 'pages/dashboard/pages/projects/components/list/projects-list.module';
import { ProjectSelectedModule } from 'pages/dashboard/pages/projects/components/selected/project-selected.module';
import { ProjectsComponent } from 'pages/dashboard/pages/projects/projects.component';

const ProjectsRouting = RouterModule.forChild([
  { path: '', component: ProjectsComponent }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectsRouting,
    ProjectsListModule, ProjectSelectedModule, SmoothHeightModule
  ],
  declarations: [ ProjectsComponent ],
  exports:      [ ProjectsComponent ]
})
export class ProjectsModule {}
