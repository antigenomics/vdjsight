import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleClonotypesTableModule } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table/sample-clonotypes-table.module';
import { SampleClonotypesTableFiltersModule } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table_filters/sample-clonotypes-table-filters.module';
import { SampleClonotypesTablePaginationComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table_pagination/sample-clonotypes-table-pagination.component';
import { SampleClonotypesWrapperComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_wrapper/sample-clonotypes-wrapper.component';
import { SampleClonotypesComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/sample-clonotypes.component';

@NgModule({
  imports:      [ CommonModule, SampleClonotypesTableModule, SampleClonotypesTableFiltersModule ],
  declarations: [
    SampleClonotypesComponent,
    SampleClonotypesWrapperComponent,
    SampleClonotypesTablePaginationComponent
  ],
  exports:      [ SampleClonotypesComponent ]
})
export class SampleClonotypesModule {}
