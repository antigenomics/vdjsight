import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectResultsComponent } from 'pages/dashboard/pages/project/pages/results/results.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ProjectResultsComponent ],
  exports:      [ ProjectResultsComponent ]
})
export class ProjectResultsModule {}
