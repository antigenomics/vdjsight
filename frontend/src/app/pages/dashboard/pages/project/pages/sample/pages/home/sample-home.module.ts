import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleHomeComponent } from 'pages/dashboard/pages/project/pages/sample/pages/home/sample-home.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ SampleHomeComponent ],
  exports:      [ SampleHomeComponent ]
})
export class SampleHomeModule {}
