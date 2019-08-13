import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';

@Component({
  selector:        'vs-sample-header',
  templateUrl:     './sample-header.component.html',
  styleUrls:       [ './sample-header.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleHeaderComponent {
  @Input()
  public sample: SampleEntity;

  @Output()
  public onClose = new EventEmitter();
}
