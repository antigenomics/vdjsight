import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectUploadComponent } from 'pages/dashboard/pages/project/pages/upload/upload.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ProjectUploadComponent ],
  exports:      [ ProjectUploadComponent ]
})
export class ProjectUploadModule {}
