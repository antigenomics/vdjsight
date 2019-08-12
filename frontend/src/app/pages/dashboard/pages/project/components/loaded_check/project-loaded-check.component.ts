import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingContentAnimation } from 'pages/dashboard/pages/project/components/loaded_check/project-loaded-check.animations';
import { StateLoadingStatus } from 'utils/state/state';

@Component({
  selector:        'vs-project-loaded-check',
  templateUrl:     './project-loaded-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ LoadingContentAnimation ]
})
export class ProjectLoadedCheckComponent {
  @Input()
  public status: StateLoadingStatus;

  @Output()
  public onReload = new EventEmitter();
}
