import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DashboardPageComponent } from 'pages/dashboard/dashboard.component';
import { AnalysisEffects } from 'pages/dashboard/models/analysis/analysis.effects';
import { DashboardModuleReducers } from 'pages/dashboard/models/dashboard.state';
import { ProjectsEffects } from 'pages/dashboard/models/projects/projects.effects';
import { SampleFilesEffects } from 'pages/dashboard/models/samples/samples.effects';
import { AnalysisService } from 'pages/dashboard/services/analysis/analysis.service';
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
    EffectsModule.forFeature([ ProjectsEffects, SampleFilesEffects, AnalysisEffects ])
  ],
  declarations: [ DashboardPageComponent ],
  providers:    [ ProjectsService, SamplesService, AnalysisService ]
})
export class DashboardModule {}
