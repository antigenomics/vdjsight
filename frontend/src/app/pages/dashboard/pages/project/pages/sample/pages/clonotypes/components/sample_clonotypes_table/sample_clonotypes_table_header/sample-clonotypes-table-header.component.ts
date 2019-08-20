import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector:        'tr[vs-sample-clonotypes-table-header]',
  templateUrl:     './sample-clonotypes-table-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTableHeaderComponent {
  @Input()
  public sort: string;

  @Output()
  public onHeaderSelect = new EventEmitter<string>();

  public sorted(column: string): string {
    if (this.sort === 'none') {
      return '';
    } else {
      const [ c, d ] = this.sort.split(':');
      if (c === column) {
        return d === 'desc' ? 'sorted descending' : 'sorted ascending';
      } else {
        return '';
      }
    }
  }
}
