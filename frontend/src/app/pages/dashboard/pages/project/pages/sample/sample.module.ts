import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SampleHeaderComponent } from 'pages/dashboard/pages/project/pages/sample/components/header/sample-header.component';
import { SampleLoadedCheckComponent } from 'pages/dashboard/pages/project/pages/sample/components/loaded_check/sample-loaded-check.component';
import { DashboardSampleModuleReducers } from 'pages/dashboard/pages/project/pages/sample/models/dashboard-sample.state';
import { SampleEffects } from 'pages/dashboard/pages/project/pages/sample/models/sample/sample.effects';
import { SampleHomeComponent } from 'pages/dashboard/pages/project/pages/sample/pages/home/sample-home.component';
import { SampleHomeModule } from 'pages/dashboard/pages/project/pages/sample/pages/home/sample-home.module';
import { ProjectSampleComponent } from 'pages/dashboard/pages/project/pages/sample/sample.component';

const ProjectSampleRouting = RouterModule.forChild([
  {
    path:     ':uuid', component: ProjectSampleComponent,
    children: [
      { path: '', component: SampleHomeComponent }
    ]
  }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectSampleRouting,
    StoreModule.forFeature('sample', DashboardSampleModuleReducers),
    EffectsModule.forFeature([ SampleEffects ]),
    SampleHomeModule
  ],
  declarations: [ ProjectSampleComponent, SampleLoadedCheckComponent, SampleHeaderComponent ],
  exports:      [ ProjectSampleComponent ]
})
export class ProjectSampleModule {}
