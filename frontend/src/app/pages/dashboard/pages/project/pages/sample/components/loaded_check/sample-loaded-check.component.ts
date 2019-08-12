import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingContentAnimation } from 'pages/dashboard/pages/project/pages/sample/components/loaded_check/sample-loaded-check.animations';
import { StateLoadingStatus } from 'utils/state/state';

@Component({
  selector:        'vs-sample-loaded-check',
  templateUrl:     './sample-loaded-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ LoadingContentAnimation ]
})
export class SampleLoadedCheckComponent {
  @Input()
  public status: StateLoadingStatus;

  @Output()
  public onReload = new EventEmitter();
}
