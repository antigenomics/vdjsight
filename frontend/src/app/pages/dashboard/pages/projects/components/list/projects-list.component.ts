import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'div[vs-projects-list]',
  templateUrl:     './projects-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation ]
})
export class ProjectsListComponent {
  @Input()
  public projects: ProjectEntity[];

  @Output()
  public onDelete = new EventEmitter<ProjectEntity>();
}
