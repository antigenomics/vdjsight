import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DebouncedInputModule } from 'directives/debounced_input/debounced-input.module';
import { ProjectHighlightedFormComponent } from 'pages/dashboard/pages/projects/components/highlighted/project-form/project-highlighted-form.component';
import { ProjectHighlightedComponent } from 'pages/dashboard/pages/projects/components/highlighted/project-highlighted.component';
import { ProjectHighlightedUtilButtonsComponent } from 'pages/dashboard/pages/projects/components/highlighted/util-buttons/project-highlighted-util-buttons.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, DebouncedInputModule ],
  declarations: [ ProjectHighlightedComponent, ProjectHighlightedFormComponent, ProjectHighlightedUtilButtonsComponent ],
  exports:      [ ProjectHighlightedComponent, ProjectHighlightedUtilButtonsComponent ]
})
export class ProjectHighlightedModule {}
