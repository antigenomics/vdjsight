import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector:        'vs-projects-buttons',
  templateUrl:     './project-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectButtonsComponent {
  @Output()
  public onCreate = new EventEmitter();
}
