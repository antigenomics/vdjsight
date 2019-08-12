import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FadeInAnimation } from 'animations/fade-in.animation';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'vs-projects-preview-utils-panel',
  templateUrl:     './projects-preview-utils-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FadeInAnimation ]
})
export class ProjectsPreviewUtilsPanelComponent {
  @Input()
  public preview?: ProjectEntity;

  @Output()
  public onDelete = new EventEmitter<ProjectEntity>();
}
