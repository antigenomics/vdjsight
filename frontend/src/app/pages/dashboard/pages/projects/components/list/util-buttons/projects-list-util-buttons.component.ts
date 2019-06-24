import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector:        'vs-projects-list-util-buttons',
  templateUrl:     './projects-list-util-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListUtilButtonsComponent {
  @Output()
  public onCreate = new EventEmitter();
}
