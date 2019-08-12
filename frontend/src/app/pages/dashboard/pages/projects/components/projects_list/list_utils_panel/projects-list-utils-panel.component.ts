import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector:        'vs-projects-list-utils-panel',
  templateUrl:     './projects-list-utils-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListUtilsPanelComponent {
  @Output()
  public onCreate = new EventEmitter();
}
