import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SidebarModule } from 'pages/dashboard/pages/project/components/sidebar/sidebar.module';
import { DashboardProjectModuleReducers } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { ProjectEffects } from 'pages/dashboard/pages/project/models/project/project.effects';
import { SampleFilesEffects } from 'pages/dashboard/pages/project/models/samples/samples.effects';
import { ProjectResultsComponent } from 'pages/dashboard/pages/project/pages/results/results.component';
import { ProjectResultsModule } from 'pages/dashboard/pages/project/pages/results/results.module';
import { ProjectUploadComponent } from 'pages/dashboard/pages/project/pages/upload/upload.component';
import { ProjectUploadModule } from 'pages/dashboard/pages/project/pages/upload/upload.module';
import { ProjectComponent } from 'pages/dashboard/pages/project/project.component';
import { SampleFilesService } from 'pages/dashboard/pages/project/services/sample-files.service';

const ProjectRouting = RouterModule.forChild([
  {
    path:     ':uuid', component: ProjectComponent,
    children: [
      { path: '', component: ProjectResultsComponent },
      { path: 'upload', component: ProjectUploadComponent }
    ]
  }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectRouting,
    StoreModule.forFeature('project', DashboardProjectModuleReducers),
    EffectsModule.forFeature([ ProjectEffects, SampleFilesEffects ]),
    SidebarModule, ProjectResultsModule, ProjectUploadModule
  ],
  declarations: [ ProjectComponent ],
  exports:      [ ProjectComponent ],
  providers:    [ SampleFilesService ]
})
export class ProjectModule {}
