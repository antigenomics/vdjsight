import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleClonotypesComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/sample-clonotypes.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ SampleClonotypesComponent ],
  exports:      [ SampleClonotypesComponent ]
})
export class SampleClonotypesModule {}
