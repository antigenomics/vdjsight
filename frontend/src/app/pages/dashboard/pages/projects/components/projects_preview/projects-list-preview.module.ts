import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputDirectivesModule } from 'directives/input/input.module';
import { TooltipModule } from 'directives/tooltip/tooltip.module';
import { ProjectsPreviewUpdateFormComponent } from 'pages/dashboard/pages/projects/components/projects_preview/preview_update_form/projects-preview-update-form.component';
import { ProjectsPreviewUtilsPanelComponent } from 'pages/dashboard/pages/projects/components/projects_preview/preview_utils_panel/projects-preview-utils-panel.component';
import { ProjectsListPreviewComponent } from 'pages/dashboard/pages/projects/components/projects_preview/projects-list-preview.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, InputDirectivesModule, TooltipModule, RouterModule ],
  declarations: [ ProjectsListPreviewComponent, ProjectsPreviewUpdateFormComponent, ProjectsPreviewUtilsPanelComponent ],
  exports:      [ ProjectsListPreviewComponent, ProjectsPreviewUtilsPanelComponent ]
})
export class ProjectsListPreviewModule {}
