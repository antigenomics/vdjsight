import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectButtonsModule } from 'pages/dashboard/pages/projects/containers/buttons/project-buttons.module';
import { ProjectItemsModule } from 'pages/dashboard/pages/projects/containers/items/project-items.module';
import { ProjectsComponent } from 'pages/dashboard/pages/projects/projects.component';

@NgModule({
  imports:      [ CommonModule, ProjectItemsModule, ProjectButtonsModule ],
  declarations: [ ProjectsComponent ],
  exports:      [ ProjectsComponent ]
})
export class ProjectsModule {}
