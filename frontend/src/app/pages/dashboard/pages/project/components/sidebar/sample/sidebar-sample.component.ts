import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';

@Component({
  selector:        'vs-sidebar-sample',
  templateUrl:     './sidebar-sample.component.html',
  styleUrls:       [ './sidebar-sample.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation ]
})
export class SidebarSampleComponent {
  @Input()
  public sample: SampleEntity;
}
