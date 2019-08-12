import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClonotypeTableView } from 'pages/dashboard/services/analysis/analysis-clonotypes';

@Component({
  selector:        'vs-sample-clonotypes-table',
  templateUrl:     './sample-clonotypes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTableComponent {
  @Input()
  public view: ClonotypeTableView;
}
