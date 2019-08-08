import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector:        'vs-projects-list-utils',
  templateUrl:     './projects-list-utils.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListUtilsComponent {
  @Output()
  public onCreate = new EventEmitter();
}
