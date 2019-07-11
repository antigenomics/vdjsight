import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectEntity } from 'pages/dashboard/pages/projects/models/projects/projects';
import { ProjectsListAnimation } from 'pages/dashboard/pages/projects/components/list/projects-list.animations';
import { FadeInAnimation } from 'animations/fade-in.animation';

@Component({
  selector:        'div[vs-projects-list]',
  templateUrl:     './projects-list.component.html',
  styleUrls:       [ './projects-list.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ProjectsListAnimation, FadeInAnimation ]
})
export class ProjectsListComponent {
  @Input()
  public projects: ProjectEntity[];

  @Input()
  public selected: { isDefined: boolean, get?: ProjectEntity };

  @Output()
  public onSelect = new EventEmitter<ProjectEntity>();

  public trackProjectBy(_: number, item: ProjectEntity) {
    return item.id;
  }
}
