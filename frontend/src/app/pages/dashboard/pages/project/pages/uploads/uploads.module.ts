import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { InputComponentsModule } from 'components/input/input.module';
import { FilesDialogComponent } from 'pages/dashboard/pages/project/pages/uploads/components/files_dialog/files-dialog.component';
import { FilesDropComponent } from 'pages/dashboard/pages/project/pages/uploads/components/files_drop/files-drop.component';
import { FilesErrorsComponent } from 'pages/dashboard/pages/project/pages/uploads/components/files_errors/files-errors.component';
import { FilesWarningsComponent } from 'pages/dashboard/pages/project/pages/uploads/components/files_warnings/files-warnings.component';
import { FilesHeaderComponent } from 'pages/dashboard/pages/project/pages/uploads/components/header/header.component';
import { UploadComponentModule } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload.module';
import { DashboardProjectUploadModuleReducers } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadsEffects } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.effects';
import { FilesDialogService } from 'pages/dashboard/pages/project/pages/uploads/services/files-dialog.service';
import { FilesUploaderService } from 'pages/dashboard/pages/project/pages/uploads/services/files-uploader.service';
import { ProjectUploadsComponent } from 'pages/dashboard/pages/project/pages/uploads/uploads.component';

const ProjectUploadRouting = RouterModule.forChild([
  { path: '', component: ProjectUploadsComponent }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectUploadRouting,
    StoreModule.forFeature('uploads', DashboardProjectUploadModuleReducers),
    EffectsModule.forFeature([ UploadsEffects ]),
    UploadComponentModule, InputComponentsModule
  ],
  declarations: [
    ProjectUploadsComponent,
    FilesErrorsComponent,
    FilesWarningsComponent,
    FilesDialogComponent,
    FilesDropComponent,
    FilesHeaderComponent
  ],
  exports:      [ ProjectUploadsComponent ],
  providers:    [ FilesDialogService, FilesUploaderService ]
})
export class ProjectUploadsModule {}
