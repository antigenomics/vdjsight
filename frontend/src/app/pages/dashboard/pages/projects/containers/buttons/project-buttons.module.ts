import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectButtonsComponent } from 'pages/dashboard/pages/projects/containers/buttons/project-buttons.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ProjectButtonsComponent ],
  exports:      [ ProjectButtonsComponent ]
})
export class ProjectButtonsModule {}
