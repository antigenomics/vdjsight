import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { InputComponentsModule } from 'components/input/input.module';
import { UploadsDialogComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_dialog/uploads-dialog.component';
import { UploadsDropComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_drop/uploads-drop.component';
import { UploadsErrorsComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_errors/uploads-errors.component';
import { UploadsWarningsComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_warnings/uploads-warnings.component';
import { UploadsHeaderComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_header/uploads-header.component';
import { UploadsEntityComponentModule } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/uploads-entity.module';
import { DashboardProjectUploadModuleReducers } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadsEffects } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.effects';
import { FilesDialogService } from 'pages/dashboard/pages/project/pages/uploads/services/files-dialog.service';
import { UploadsService } from 'pages/dashboard/pages/project/pages/uploads/services/uploads.service';
import { ProjectUploadsComponent } from 'pages/dashboard/pages/project/pages/uploads/uploads.component';

const ProjectUploadRouting = RouterModule.forChild([
  { path: '', component: ProjectUploadsComponent }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectUploadRouting,
    StoreModule.forFeature('uploads', DashboardProjectUploadModuleReducers),
    EffectsModule.forFeature([ UploadsEffects ]),
    UploadsEntityComponentModule, InputComponentsModule
  ],
  declarations: [
    ProjectUploadsComponent,
    UploadsErrorsComponent,
    UploadsWarningsComponent,
    UploadsDialogComponent,
    UploadsDropComponent,
    UploadsHeaderComponent
  ],
  exports:      [ ProjectUploadsComponent ],
  providers:    [ FilesDialogService, UploadsService ]
})
export class ProjectUploadsModule {}
