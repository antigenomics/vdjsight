import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'directives/tooltip/tooltip.module';
import { SampleClonotypesTableComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample-clonotypes-table.component';
import { SampleClonotypesTableHeaderComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample_clonotypes_table_header/sample-clonotypes-table-header.component';
import { SampleClonotypesTableRowComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample_clonotypes_table_row/sample-clonotypes-table-row.component';
import { SampleClonotypesTableRowCdr3Component } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample_clonotypes_table_row/sample_clonotypes_table_row_cdr3/sample-clonotypes-table-row-cdr3.component';
import { PrecisionNumberPipeModule } from 'pipes/precision_number/precision-number.module';

@NgModule({
  imports:      [ CommonModule, TooltipModule, PrecisionNumberPipeModule ],
  declarations: [
    SampleClonotypesTableComponent,
    SampleClonotypesTableHeaderComponent,
    SampleClonotypesTableRowComponent,
    SampleClonotypesTableRowCdr3Component
  ],
  exports:      [ SampleClonotypesTableComponent ]
})
export class SampleClonotypesTableModule {}
