import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponentsModule } from 'components/input/input.module';
import { InputDirectivesModule } from 'directives/input/input.module';
import { HumanReadableSizePipe } from 'pages/dashboard/pages/project/pages/uploads/components/upload/pipes/human-readable-size.pipe';
import { UploadComponent } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload.component';
import { UploadNameComponent } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload_name/upload-name.component';
import { UploadSoftwareComponent } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload_software/upload-software.component';
import { UploadStatusComponent } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload_status/upload-status.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, InputDirectivesModule, InputComponentsModule ],
  declarations: [
    UploadComponent,
    UploadNameComponent,
    UploadSoftwareComponent,
    UploadStatusComponent,
    HumanReadableSizePipe
  ],
  exports:      [ UploadComponent ]
})
export class UploadComponentModule {}
