import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputDirectivesModule } from 'directives/input/input.module';
import { TooltipModule } from 'directives/tooltip/tooltip.module';
import { ProjectSelectedFormComponent } from 'pages/dashboard/pages/projects/components/selected/project-form/project-selected-form.component';
import { ProjectSelectedComponent } from 'pages/dashboard/pages/projects/components/selected/project-selected.component';
import { ProjectSelectedUtilButtonsComponent } from 'pages/dashboard/pages/projects/components/selected/util-buttons/project-selected-util-buttons.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, InputDirectivesModule, TooltipModule, RouterModule ],
  declarations: [ ProjectSelectedComponent, ProjectSelectedFormComponent, ProjectSelectedUtilButtonsComponent ],
  exports:      [ ProjectSelectedComponent, ProjectSelectedUtilButtonsComponent ]
})
export class ProjectSelectedModule {}
