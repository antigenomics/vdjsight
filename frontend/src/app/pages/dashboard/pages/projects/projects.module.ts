import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectsListModule } from 'pages/dashboard/pages/projects/components/list/projects-list.module';
import { ProjectsComponent } from 'pages/dashboard/pages/projects/projects.component';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectHighlightedModule } from 'pages/dashboard/pages/projects/components/highlighted/project-highlighted.module';

@NgModule({
  imports:      [ CommonModule, ProjectsListModule, ProjectHighlightedModule, SmoothHeightModule ],
  declarations: [ ProjectsComponent ],
  exports:      [ ProjectsComponent ]
})
export class ProjectsModule {}
