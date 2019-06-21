import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ProjectItemComponent } from 'pages/dashboard/pages/projects/containers/items/item/project-item.component';
import { ProjectItemsComponent } from 'pages/dashboard/pages/projects/containers/items/project-items.component';

@NgModule({
  imports:      [ CommonModule, SmoothHeightModule ],
  declarations: [ ProjectItemsComponent, ProjectItemComponent ],
  exports:      [ ProjectItemsComponent ]
})
export class ProjectItemsModule {}
