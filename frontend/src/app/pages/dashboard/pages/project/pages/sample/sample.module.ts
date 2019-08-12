import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SampleHeaderComponent } from 'pages/dashboard/pages/project/pages/sample/components/header/sample-header.component';
import { SampleLoadedCheckComponent } from 'pages/dashboard/pages/project/pages/sample/components/loaded_check/sample-loaded-check.component';
import { SampleClonotypesComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/sample-clonotypes.component';
import { SampleClonotypesModule } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/sample-clonotypes.module';
import { SampleHomeComponent } from 'pages/dashboard/pages/project/pages/sample/pages/home/sample-home.component';
import { SampleHomeModule } from 'pages/dashboard/pages/project/pages/sample/pages/home/sample-home.module';
import { SampleSpectratypeComponent } from 'pages/dashboard/pages/project/pages/sample/pages/spectratype/sample-spectratype.component';
import { SampleSpectratypeModule } from 'pages/dashboard/pages/project/pages/sample/pages/spectratype/sample-spectratype.module';
import { ProjectSampleComponent } from 'pages/dashboard/pages/project/pages/sample/sample.component';

const ProjectSampleRouting = RouterModule.forChild([
  {
    path:     ':uuid', component: ProjectSampleComponent,
    children: [
      { path: 'info', component: SampleHomeComponent },
      { path: 'clonotypes', component: SampleClonotypesComponent },
      { path: 'spectratype', component: SampleSpectratypeComponent },
      { path: '', redirectTo: 'info', pathMatch: 'full' }
    ]
  }
]);

@NgModule({
  imports:      [
    CommonModule, ProjectSampleRouting,
    SampleHomeModule, SampleClonotypesModule, SampleSpectratypeModule
  ],
  declarations: [ ProjectSampleComponent, SampleLoadedCheckComponent, SampleHeaderComponent ],
  exports:      [ ProjectSampleComponent ]
})
export class ProjectSampleModule {}
