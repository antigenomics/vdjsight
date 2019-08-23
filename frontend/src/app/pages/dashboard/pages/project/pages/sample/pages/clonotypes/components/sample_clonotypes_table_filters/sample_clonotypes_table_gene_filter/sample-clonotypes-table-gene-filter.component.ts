import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector:        'vs-sample-clonotypes-table-gene-filter',
  templateUrl:     './sample-clonotypes-table-gene-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTableGeneFilterComponent {
  @Input()
  public gene: string;

  @Input()
  public selected: string[];

  @Output()
  public onSelect = new EventEmitter<string>();

  @Output()
  public onRemove = new EventEmitter<string>();
}
