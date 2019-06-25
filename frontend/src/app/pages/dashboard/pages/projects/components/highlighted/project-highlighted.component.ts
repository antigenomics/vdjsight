import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'vs-project-highlighted',
  templateUrl:     './project-highlighted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectHighlightedComponent {
  @Input()
  public highlighted?: ProjectEntity;

  @Output()
  public onUpdate = new EventEmitter<{ project: ProjectEntity, name: string, description: string }>();

  public update(event: { name: string, description: string }): void {
    this.onUpdate.emit({ project: this.highlighted, name: event.name, description: event.description });
  }
}


