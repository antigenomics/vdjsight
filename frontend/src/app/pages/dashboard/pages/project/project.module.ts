import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'pages/dashboard/pages/project/components/sidebar/sidebar.module';
import { ProjectResultsComponent } from 'pages/dashboard/pages/project/pages/results/results.component';
import { ProjectResultsModule } from 'pages/dashboard/pages/project/pages/results/results.module';
import { ProjectUploadComponent } from 'pages/dashboard/pages/project/pages/upload/upload.component';
import { ProjectUploadModule } from 'pages/dashboard/pages/project/pages/upload/upload.module';
import { ProjectComponent } from 'pages/dashboard/pages/project/project.component';

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
  imports:      [ CommonModule, ProjectRouting, SidebarModule, ProjectResultsModule, ProjectUploadModule ],
  declarations: [ ProjectComponent ],
  exports:      [ ProjectComponent ]
})
export class ProjectModule {}
