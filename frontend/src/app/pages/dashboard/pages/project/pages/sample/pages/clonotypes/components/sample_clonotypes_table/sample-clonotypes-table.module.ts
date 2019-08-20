import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleClonotypesTableComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample-clonotypes-table.component';
import { SampleClonotypesTableHeaderComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample_clonotypes_table_header/sample-clonotypes-table-header.component';
import { SampleClonotypesTableRowComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample_clonotypes_table_row/sample-clonotypes-table-row.component';
import { PrecisionNumberPipeModule } from 'pipes/precision_number/precision-number.module';

@NgModule({
  imports:      [ CommonModule, PrecisionNumberPipeModule ],
  declarations: [ SampleClonotypesTableComponent, SampleClonotypesTableHeaderComponent, SampleClonotypesTableRowComponent ],
  exports:      [ SampleClonotypesTableComponent ]
})
export class SampleClonotypesTableModule {}
