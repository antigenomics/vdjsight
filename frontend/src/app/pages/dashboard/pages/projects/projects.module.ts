import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectsListModule } from 'pages/dashboard/pages/projects/components/list/projects-list.module';
import { ProjectSelectedModule } from 'pages/dashboard/pages/projects/components/selected/project-selected.module';
import { DashboardProjectsModuleReducers } from 'pages/dashboard/pages/projects/models/dashboard-projects.state';
import { ProjectsEffects } from 'pages/dashboard/pages/projects/models/projects/projects.effects';
import { ProjectsComponent } from 'pages/dashboard/pages/projects/projects.component';

const ProjectsRouting = RouterModule.forChild([
  { path: '', component: ProjectsComponent }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectsRouting,
    StoreModule.forFeature('projects', DashboardProjectsModuleReducers),
    EffectsModule.forFeature([ ProjectsEffects ]),
    ProjectsListModule, ProjectSelectedModule, SmoothHeightModule
  ],
  declarations: [ ProjectsComponent ],
  exports:      [ ProjectsComponent ]
})
export class ProjectsModule {}
