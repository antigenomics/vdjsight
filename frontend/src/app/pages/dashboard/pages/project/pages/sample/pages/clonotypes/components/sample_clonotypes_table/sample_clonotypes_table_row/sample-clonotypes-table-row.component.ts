import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClonotypeTableRow } from 'pages/dashboard/services/analysis/analysis-clonotypes';

@Component({
  selector:        'tr[vs-sample-clonotypes-table-row]',
  templateUrl:     './sample-clonotypes-table-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTableRowComponent {
  @Input()
  public row: ClonotypeTableRow;
}
