import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClonotypeTableRowMarkup } from 'pages/dashboard/services/analysis/analysis-clonotypes';
import { SequenceUtils } from 'utils/sequence/sequence.utils';

@Component({
  selector:        'vs-sample-clonotypes-table-row-cdr3',
  styleUrls:       [ './sample-clonotypes-table-row-cdr3.component.less' ],
  templateUrl:     './sample-clonotypes-table-row-cdr3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleClonotypesTableRowCdr3Component {
  @Input()
  public cdr3aa: string;

  @Input()
  public cdr3nt: string;

  @Input()
  public markup: ClonotypeTableRowMarkup;

  public get cdr3aaRegions(): SequenceUtils.ColorizedPatternRegion[] {
    return SequenceUtils.colorizePattern(this.cdr3aa, this.markup.vend, this.markup.dstart, this.markup.dend, this.markup.jstart, 3);
  }

  public get cdr3ntRegions(): SequenceUtils.ColorizedPatternRegion[] {
    return SequenceUtils.colorizePattern(this.cdr3nt, this.markup.vend, this.markup.dstart, this.markup.dend, this.markup.jstart, 1);
  }
}
