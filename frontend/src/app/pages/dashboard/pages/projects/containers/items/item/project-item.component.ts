import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'div[vs-project-item]',
  templateUrl:     './project-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent {
  @Input()
  public project: ProjectEntity;
}
