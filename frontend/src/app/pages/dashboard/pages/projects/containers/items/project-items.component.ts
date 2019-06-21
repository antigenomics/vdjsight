import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';

@Component({
  selector:        'div[vs-project-items]',
  templateUrl:     './project-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation ]
})
export class ProjectItemsComponent {
  @Input()
  public projects: ProjectEntity[];
}
