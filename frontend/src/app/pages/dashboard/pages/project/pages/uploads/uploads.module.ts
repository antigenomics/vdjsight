import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UploadComponent } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload.component';
import { DashboardProjectUploadModuleReducers } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadsEffects } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.effects';
import { ProjectUploadsComponent } from 'pages/dashboard/pages/project/pages/uploads/uploads.component';

const ProjectUploadRouting = RouterModule.forChild([
  { path: '', component: ProjectUploadsComponent }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectUploadRouting,
    StoreModule.forFeature('uploads', DashboardProjectUploadModuleReducers),
    EffectsModule.forFeature([ UploadsEffects ])
  ],
  declarations: [ ProjectUploadsComponent, UploadComponent ],
  exports:      [ ProjectUploadsComponent ]
})
export class ProjectUploadsModule {}
