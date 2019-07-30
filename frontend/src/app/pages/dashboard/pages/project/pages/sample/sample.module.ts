import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { DashboardSampleModuleReducers } from 'pages/dashboard/pages/project/pages/sample/models/dashboard-sample.state';
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
    SampleHomeModule
  ],
  declarations: [ ProjectSampleComponent ],
  exports:      [ ProjectSampleComponent ]
})
export class ProjectSampleModule {}
