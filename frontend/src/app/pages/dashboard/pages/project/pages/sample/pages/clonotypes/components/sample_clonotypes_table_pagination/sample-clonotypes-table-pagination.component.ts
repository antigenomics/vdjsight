import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector:        'vs-sample-clonotypes-table-pagination',
  styleUrls:       [ './sample-clonotypes-table-pagination.component.less' ],
  templateUrl:     './sample-clonotypes-table-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTablePaginationComponent implements OnChanges {
  public readonly pages = new ReplaySubject<number[]>(1);

  @Input()
  public total: number;

  @Input()
  public current: number;

  @Input()
  public range: number;

  @Output()
  public onPageChange = new EventEmitter();

  public first(): void {
    this.onPageChange.emit(1);
  }

  public previous(): void {
    this.onPageChange.emit(this.current - 1);
  }

  public next(): void {
    this.onPageChange.emit(this.current + 1);
  }

  public last(): void {
    this.onPageChange.emit(this.total);
  }

  public ngOnChanges(): void {
    const { min, max }      = this.calculateRange();
    const numbers: number[] = [];
    for (let i = min; i <= max; ++i) {
      numbers.push(i);
    }
    this.pages.next(numbers);
  }

  private calculateRange(): { min: number, max: number } {
    if (this.range * 2 >= this.total) {
      return {
        min: 1,
        max: this.total
      };
    }

    let min = this.current - this.range;
    let max = this.current + this.range;

    if (min < 1) {
      max -= min;
      min = 1;
    } else if (max > (this.total - 1)) {
      min -= (max - this.total);
      max = this.total;
    }

    return { min: min < 1 ? 1 : min, max: max > this.total ? this.total : max };
  }
}
