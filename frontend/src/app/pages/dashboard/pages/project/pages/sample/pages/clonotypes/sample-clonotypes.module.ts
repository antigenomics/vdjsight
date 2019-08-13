import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleClonotypesTableModule } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample-clonotypes-table.module';
import { SampleClonotypesTablePaginationComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table_pagination/sample-clonotypes-table-pagination.component';
import { SampleClonotypesComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/sample-clonotypes.component';

@NgModule({
  imports:      [ CommonModule, SampleClonotypesTableModule ],
  declarations: [ SampleClonotypesComponent, SampleClonotypesTablePaginationComponent ],
  exports:      [ SampleClonotypesComponent ]
})
export class SampleClonotypesModule {}
