import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FadeInAnimation } from 'animations/fade-in.animation';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'div[vs-projects-list-preview]',
  templateUrl:     './projects-list-preview.component.html',
  styleUrls:       [ './projects-list-preview.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FadeInAnimation ]
})
export class ProjectsListPreviewComponent {
  @Input()
  public preview?: ProjectEntity;

  @Output()
  public onClose = new EventEmitter();

  @Output()
  public onUpdate = new EventEmitter<{ project: ProjectEntity, name: string, description: string }>();

  public update(event: { name: string, description: string }): void {
    if (this.preview !== undefined) {
      this.onUpdate.emit({ project: this.preview, name: event.name, description: event.description });
    }
  }
}


