import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleClonotypesTableModule } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample-clonotypes-table.module';
import { SampleClonotypesComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/sample-clonotypes.component';

@NgModule({
  imports:      [ CommonModule, SampleClonotypesTableModule ],
  declarations: [ SampleClonotypesComponent ],
  exports:      [ SampleClonotypesComponent ]
})
export class SampleClonotypesModule {}
