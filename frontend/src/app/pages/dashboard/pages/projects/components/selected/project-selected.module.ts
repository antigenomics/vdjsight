import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebouncedInputModule } from 'directives/debounced_input/debounced-input.module';
import { EnterInputModule } from 'directives/enter_input/enter-input.module';
import { TooltipModule } from 'directives/tooltip/tooltip.module';
import { ProjectSelectedFormComponent } from 'pages/dashboard/pages/projects/components/selected/project-form/project-selected-form.component';
import { ProjectSelectedComponent } from 'pages/dashboard/pages/projects/components/selected/project-selected.component';
import { ProjectSelectedUtilButtonsComponent } from 'pages/dashboard/pages/projects/components/selected/util-buttons/project-selected-util-buttons.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ CommonModule, FormsModule, DebouncedInputModule, EnterInputModule, TooltipModule, RouterModule ],
  declarations: [ ProjectSelectedComponent, ProjectSelectedFormComponent, ProjectSelectedUtilButtonsComponent ],
  exports:      [ ProjectSelectedComponent, ProjectSelectedUtilButtonsComponent ]
})
export class ProjectSelectedModule {}
