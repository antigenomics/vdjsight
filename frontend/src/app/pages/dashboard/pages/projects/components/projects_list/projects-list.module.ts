import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectsListComponent } from 'pages/dashboard/pages/projects/components/projects_list/projects-list.component';
import { ProjectsListEntityComponent } from 'pages/dashboard/pages/projects/components/projects_list/list_entity/projects-list-entity.component';
import { ProjectsListUtilsPanelComponent } from 'pages/dashboard/pages/projects/components/projects_list/list_utils_panel/projects-list-utils-panel.component';
import { TruncatePipeModule } from 'pipes/truncate/truncate.module';

@NgModule({
  imports:      [ CommonModule, SmoothHeightModule, TruncatePipeModule ],
  declarations: [ ProjectsListComponent, ProjectsListEntityComponent, ProjectsListUtilsPanelComponent ],
  exports:      [ ProjectsListComponent, ProjectsListUtilsPanelComponent ]
})
export class ProjectsListModule {}
