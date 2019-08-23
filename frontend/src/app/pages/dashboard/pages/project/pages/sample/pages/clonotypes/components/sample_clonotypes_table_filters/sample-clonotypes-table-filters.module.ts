import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponentsModule } from 'components/input/input.module';
import { SampleClonotypesTableFiltersComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table_filters/sample-clonotypes-table-filters.component';
import { SampleClonotypesTableGeneFilterComponent } from 'pages/dashboard/pages/project/pages/sample/pages/clonotypes/components/sample_clonotypes_table_filters/sample_clonotypes_table_gene_filter/sample-clonotypes-table-gene-filter.component';

@NgModule({
  imports:      [ CommonModule, InputComponentsModule, FormsModule ],
  declarations: [
    SampleClonotypesTableFiltersComponent,
    SampleClonotypesTableGeneFilterComponent
  ],
  exports:      [ SampleClonotypesTableFiltersComponent ]
})
export class SampleClonotypesTableFiltersModule {}
