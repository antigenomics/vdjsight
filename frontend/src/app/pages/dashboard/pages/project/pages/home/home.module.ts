import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectHomeComponent } from 'pages/dashboard/pages/project/pages/home/home.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ProjectHomeComponent ],
  exports:      [ ProjectHomeComponent ]
})
export class ProjectHomeModule {}
