import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectItemComponent } from 'pages/dashboard/pages/projects/components/list/item/project-item.component';
import { ProjectsListComponent } from 'pages/dashboard/pages/projects/components/list/projects-list.component';
import { ProjectsListUtilButtonsComponent } from 'pages/dashboard/pages/projects/components/list/util-buttons/projects-list-util-buttons.component';

@NgModule({
  imports:      [ CommonModule, SmoothHeightModule ],
  declarations: [ ProjectsListComponent, ProjectItemComponent, ProjectsListUtilButtonsComponent ],
  exports:      [ ProjectsListComponent, ProjectsListUtilButtonsComponent ]
})
export class ProjectsListModule {}
