import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FadeInAnimation } from 'animations/fade-in.animation';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { ProjectsListAnimation } from 'pages/dashboard/pages/projects/components/projects_list/projects-list.animations';

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
  public preview?: ProjectEntity;

  @Output()
  public onPreview = new EventEmitter<ProjectEntity>();

  @Output()
  public onFailedDiscard = new EventEmitter<ProjectEntity>();

  public trackProjectBy(_: number, item: ProjectEntity) {
    return item.id;
  }
}
