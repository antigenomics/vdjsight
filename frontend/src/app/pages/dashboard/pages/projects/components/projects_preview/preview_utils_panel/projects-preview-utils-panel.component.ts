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

  @Output()
  public onSelect = new EventEmitter<ProjectEntity>();

  public delete(): void {
    if (this.preview !== undefined) {
      this.onDelete.emit(this.preview);
    }
  }

  public select(): void {
    if (this.preview !== undefined) {
      this.onSelect.emit(this.preview);
    }
  }
}
