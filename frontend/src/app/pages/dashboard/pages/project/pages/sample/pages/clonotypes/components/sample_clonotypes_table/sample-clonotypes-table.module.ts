import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleClonotypesTableComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample-clonotypes-table.component';
import { SampleClonotypesTableRowComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample_clonotypes_table_row/sample-clonotypes-table-row.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ SampleClonotypesTableComponent, SampleClonotypesTableRowComponent ],
  exports:      [ SampleClonotypesTableComponent ]
})
export class SampleClonotypesTableModule {}
