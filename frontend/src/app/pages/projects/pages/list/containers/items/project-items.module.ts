import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectItemsComponent } from 'pages/projects/pages/list/containers/items/project-items.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ProjectItemsComponent ],
  exports:      [ ProjectItemsComponent ]
})
export class ProjectItemsModule {}
