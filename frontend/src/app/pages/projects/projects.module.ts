import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsListComponent } from 'pages/projects/pages/list/projects-list.component';
import { ProjectsListModule } from 'pages/projects/pages/list/projects-list.module';
import { ProjectsPageComponent } from 'pages/projects/projects.component';

const ProjectsRouting = RouterModule.forChild([
  {
    path:     '', component: ProjectsPageComponent,
    children: [
      { path: 'list', component: ProjectsListComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
]);

@NgModule({
  imports:      [ CommonModule, ProjectsRouting, ProjectsListModule ],
  declarations: [ ProjectsPageComponent ]
})
export class ProjectsModule {}
