import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClonotypeTablePage } from 'pages/dashboard/services/analysis/analysis-clonotypes';

@Component({
  selector:        'vs-sample-clonotypes-table',
  styleUrls:       [ './sample-clonotypes-table.component.less' ],
  templateUrl:     './sample-clonotypes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTableComponent {
  @Input()
  public page: ClonotypeTablePage;
}
