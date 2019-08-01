import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingContentAnimation } from 'pages/dashboard/pages/project/pages/sample/components/loaded_check/sample-loaded-check.animations';

@Component({
  selector:        'vs-sample-loaded-check',
  templateUrl:     './sample-loaded-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ LoadingContentAnimation ]
})
export class SampleLoadedCheckComponent {
  @Input()
  public isLoaded: boolean;

  @Input()
  public isLoading: boolean;

  @Input()
  public isLoadFailed: boolean;

  @Output()
  public onReload = new EventEmitter();
}
