import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectLoadedCheckComponent } from 'pages/dashboard/pages/project/components/loaded_check/project-loaded-check.component';
import { SidebarModule } from 'pages/dashboard/pages/project/components/sidebar/sidebar.module';
import { ProjectHomeComponent } from 'pages/dashboard/pages/project/pages/home/home.component';
import { ProjectHomeModule } from 'pages/dashboard/pages/project/pages/home/home.module';
import { ProjectComponent } from 'pages/dashboard/pages/project/project.component';

const ProjectRouting = RouterModule.forChild([
  {
    path:     ':uuid', component: ProjectComponent,
    children: [
      { path: '', component: ProjectHomeComponent },
      {
        path:         'upload',
        loadChildren: () => import('pages/dashboard/pages/project/pages/uploads/uploads.module').then((m) => m.ProjectUploadsModule)
      }
      // {
      //   path:         's',
      //   loadChildren: () => import('pages/dashboard/pages/project/pages/sample/sample.module').then((m) => m.ProjectSampleModule)
      // }
    ]
  }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectRouting,
    SidebarModule, ProjectHomeModule
  ],
  declarations: [ ProjectComponent, ProjectLoadedCheckComponent ],
  exports:      [ ProjectComponent ]
})
export class ProjectModule {}
