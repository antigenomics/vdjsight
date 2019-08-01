import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';

@Component({
  selector:        'vs-sample-header',
  templateUrl:     './sample-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleHeaderComponent {
  @Input()
  public sample: SampleEntity;
}
