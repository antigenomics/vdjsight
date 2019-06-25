import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'div[vs-projects-list]',
  templateUrl:     './projects-list.component.html',
  styleUrls:       [ './projects-list.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation ]
})
export class ProjectsListComponent {
  @Input()
  public projects: ProjectEntity[];

  @Input()
  public highlighted?: ProjectEntity;

  @Output()
  public onDelete = new EventEmitter<ProjectEntity>();

  @Output()
  public onHighlight = new EventEmitter<ProjectEntity>();

  public trackProjectBy(_: number, item: ProjectEntity) {
    return item.id;
  }
}
