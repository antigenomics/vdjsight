import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingContentAnimation } from 'pages/dashboard/pages/project/components/loaded_check/project-loaded-check.animations';

@Component({
  selector:        'vs-project-loaded-check',
  templateUrl:     './project-loaded-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ LoadingContentAnimation ]
})
export class ProjectLoadedCheckComponent {
  @Input()
  public isLoaded: boolean;

  @Input()
  public isLoading: boolean;

  @Input()
  public isLoadFailed: boolean;

  @Output()
  public onReload = new EventEmitter();
}
