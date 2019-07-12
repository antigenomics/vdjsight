import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebouncedInputModule } from 'directives/debounced_input/debounced-input.module';
import { HumanReadableSizePipe } from 'pages/dashboard/pages/project/pages/uploads/components/upload/pipes/human-readable-size.pipe';
import { UploadComponent } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload.component';
import { UploadNameComponent } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload_name/upload-name.component';
import { UploadStatusComponent } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload_status/upload-status.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, DebouncedInputModule ],
  declarations: [ UploadComponent, UploadNameComponent, HumanReadableSizePipe, UploadStatusComponent ],
  exports:      [ UploadComponent ]
})
export class UploadComponentModule {}
