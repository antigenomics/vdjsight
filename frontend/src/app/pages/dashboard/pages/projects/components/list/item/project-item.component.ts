import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'div[vs-project-item]',
  templateUrl:     './project-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent {
  @Input()
  public project: ProjectEntity;

  @Output()
  public onDelete = new EventEmitter();
}
