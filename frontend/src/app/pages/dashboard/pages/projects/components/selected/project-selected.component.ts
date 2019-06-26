import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FadeInAnimation } from 'animations/fade-in.animation';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'div[vs-project-selected]',
  templateUrl:     './project-selected.component.html',
  styleUrls:       [ './project-selected.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FadeInAnimation ]
})
export class ProjectSelectedComponent {
  @Input()
  public selected: { isDefined: boolean, get?: ProjectEntity };

  @Output()
  public onUpdate = new EventEmitter<{ project: ProjectEntity, name: string, description: string }>();

  public update(event: { name: string, description: string }): void {
    if (this.selected.isDefined) {
      this.onUpdate.emit({ project: this.selected.get, name: event.name, description: event.description });
    }
  }
}


