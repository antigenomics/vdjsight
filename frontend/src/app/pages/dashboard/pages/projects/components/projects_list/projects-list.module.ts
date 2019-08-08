import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectsListComponent } from 'pages/dashboard/pages/projects/components/projects_list/projects-list.component';
import { ProjectsListEntityComponent } from 'pages/dashboard/pages/projects/components/projects_list/projects_list_entity/projects-list-entity.component';
import { ProjectsListUtilsComponent } from 'pages/dashboard/pages/projects/components/projects_list/projects_list_utils/projects-list-utils.component';
import { TruncatePipeModule } from 'pipes/truncate/truncate.module';

@NgModule({
  imports:      [ CommonModule, SmoothHeightModule, TruncatePipeModule ],
  declarations: [ ProjectsListComponent, ProjectsListEntityComponent, ProjectsListUtilsComponent ],
  exports:      [ ProjectsListComponent, ProjectsListUtilsComponent ]
})
export class ProjectsListModule {}
