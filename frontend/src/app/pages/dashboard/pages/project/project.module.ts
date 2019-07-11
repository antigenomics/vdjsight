import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SidebarModule } from 'pages/dashboard/pages/project/components/sidebar/sidebar.module';
import { DashboardProjectModuleReducers } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { ProjectEffects } from 'pages/dashboard/pages/project/models/project/project.effects';
import { SampleFilesEffects } from 'pages/dashboard/pages/project/models/samples/samples.effects';
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
    ]
  }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectRouting,
    StoreModule.forFeature('project', DashboardProjectModuleReducers),
    EffectsModule.forFeature([ ProjectEffects, SampleFilesEffects ]),
    SidebarModule, ProjectHomeModule
  ],
  declarations: [ ProjectComponent ],
  exports:      [ ProjectComponent ]
})
export class ProjectModule {}
