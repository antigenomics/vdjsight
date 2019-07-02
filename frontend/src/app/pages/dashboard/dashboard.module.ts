import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DashboardPageComponent } from 'pages/dashboard/dashboard.component';
import { DashboardModuleReducers } from 'pages/dashboard/models/dashboard.state';
import { ProjectsEffects } from 'pages/dashboard/models/projects/projects.effects';
import { ProjectsComponent } from 'pages/dashboard/pages/projects/projects.component';
import { ProjectsModule } from 'pages/dashboard/pages/projects/projects.module';
import { ProjectsService } from 'pages/dashboard/services/projects.service';

const ProjectsRouting = RouterModule.forChild([
  {
    path:     '', component: DashboardPageComponent,
    children: [
      { path: 'projects', component: ProjectsComponent },
      { path: 'p', loadChildren: () => import('./pages/project/project.module').then((m) => m.ProjectModule) },
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectsRouting,
    StoreModule.forFeature('dashboard', DashboardModuleReducers),
    EffectsModule.forFeature([ ProjectsEffects ]),
    ProjectsModule
  ],
  declarations: [ DashboardPageComponent ],
  providers:    [ ProjectsService ]
})
export class DashboardModule {}
