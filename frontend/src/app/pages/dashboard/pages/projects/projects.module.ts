import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectsListModule } from 'pages/dashboard/pages/projects/components/list/projects-list.module';
import { ProjectsComponent } from 'pages/dashboard/pages/projects/projects.component';

@NgModule({
  imports:      [ CommonModule, ProjectsListModule ],
  declarations: [ ProjectsComponent ],
  exports:      [ ProjectsComponent ]
})
export class ProjectsModule {}
