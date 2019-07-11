import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardPageComponent } from 'pages/dashboard/dashboard.component';
import { ProjectsService } from 'pages/dashboard/services/projects/projects.service';
import { SampleFilesService } from 'pages/dashboard/services/sample_files/sample-files.service';

const DashboardRouting = RouterModule.forChild([
  {
    path:     '', component: DashboardPageComponent,
    children: [
      { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then((m) => m.ProjectsModule) },
      { path: 'p', loadChildren: () => import('./pages/project/project.module').then((m) => m.ProjectModule) },
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  }
]);

@NgModule({
  imports:      [ CommonModule, DashboardRouting ],
  declarations: [ DashboardPageComponent ],
  providers:    [ ProjectsService, SampleFilesService ]
})
export class DashboardModule {}
