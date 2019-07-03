import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'vs-project-sidebar',
  templateUrl:     './sidebar.component.html',
  styleUrls:       [ './sidebar.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input()
  public project: ProjectEntity;
}
