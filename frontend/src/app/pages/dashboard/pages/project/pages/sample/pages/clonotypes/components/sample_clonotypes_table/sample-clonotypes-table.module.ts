import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleClonotypesTableComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample-clonotypes-table.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ SampleClonotypesTableComponent ],
  exports:      [ SampleClonotypesTableComponent ]
})
export class SampleClonotypesTableModule {}
