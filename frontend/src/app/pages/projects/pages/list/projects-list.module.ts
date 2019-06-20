import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectItemsModule } from 'pages/projects/pages/list/containers/items/project-items.module';
import { ProjectsListComponent } from 'pages/projects/pages/list/projects-list.component';

@NgModule({
  imports:      [ CommonModule, ProjectItemsModule ],
  declarations: [ ProjectsListComponent ],
  exports:      [ ProjectsListComponent ]
})
export class ProjectsListModule {}
