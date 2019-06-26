import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectsListModule } from 'pages/dashboard/pages/projects/components/list/projects-list.module';
import { ProjectsComponent } from 'pages/dashboard/pages/projects/projects.component';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectSelectedModule } from 'pages/dashboard/pages/projects/components/selected/project-selected.module';

@NgModule({
  imports:      [ CommonModule, ProjectsListModule, ProjectSelectedModule, SmoothHeightModule ],
  declarations: [ ProjectsComponent ],
  exports:      [ ProjectsComponent ]
})
export class ProjectsModule {}
