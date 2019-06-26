import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebouncedInputModule } from 'directives/debounced_input/debounced-input.module';
import { ProjectHighlightedFormComponent } from 'pages/dashboard/pages/projects/components/selected/project-form/project-highlighted-form.component';
import { ProjectSelectedComponent } from 'pages/dashboard/pages/projects/components/selected/project-selected.component';
import { ProjectHighlightedUtilButtonsComponent } from 'pages/dashboard/pages/projects/components/selected/util-buttons/project-highlighted-util-buttons.component';
import { EnterInputModule } from 'directives/enter_input/enter-input.module';

@NgModule({
  imports:      [ CommonModule, FormsModule, DebouncedInputModule, EnterInputModule ],
  declarations: [ ProjectSelectedComponent, ProjectHighlightedFormComponent, ProjectHighlightedUtilButtonsComponent ],
  exports:      [ ProjectSelectedComponent, ProjectHighlightedUtilButtonsComponent ]
})
export class ProjectSelectedModule {}
