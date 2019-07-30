import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DashboardPageComponent } from 'pages/dashboard/dashboard.component';
import { DashboardModuleReducers } from 'pages/dashboard/models/dashboard.state';
import { ProjectsEffects } from 'pages/dashboard/models/projects/projects.effects';
import { ProjectsService } from 'pages/dashboard/services/projects/projects.service';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';

const DashboardRouting = RouterModule.forChild([
  {
    path:     '', component: DashboardPageComponent,
    children: [
      { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then((m) => m.ProjectsModule) },
      { path: 'p', loadChildren: () => import('./pages/project/project.module').then((m) => m.ProjectModule) },
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  }
]);

@NgModule({
  imports:      [
    CommonModule, DashboardRouting,
    StoreModule.forFeature('dashboard', DashboardModuleReducers),
    EffectsModule.forFeature([ ProjectsEffects ])
  ],
  declarations: [ DashboardPageComponent ],
  providers:    [ ProjectsService, SamplesService ]
})
export class DashboardModule {}
