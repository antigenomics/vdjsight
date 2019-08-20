import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ClonotypeTableAnalysisOptions, ClonotypeTablePage } from 'pages/dashboard/services/analysis/analysis-clonotypes';

@Component({
  selector:        'vs-sample-clonotypes-table',
  styleUrls:       [ './sample-clonotypes-table.component.less' ],
  templateUrl:     './sample-clonotypes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTableComponent {
  @Input()
  public page: ClonotypeTablePage;

  @Input()
  public options: ClonotypeTableAnalysisOptions;

  @Output()
  public onSort = new EventEmitter<string>();

  public onHeaderSelect(column: string): void {
    const sort = this.options.sort;
    if (sort === 'none') {
      this.onSort.emit(`${column}:asc`);
    } else {
      const [ s, d ] = sort.split(':');
      if (s === column) {
        this.onSort.emit(d === 'desc' ? `${column}:asc` : `${column}:desc`);
      } else {
        this.onSort.emit(`${column}:asc`);
      }
    }
  }
}
