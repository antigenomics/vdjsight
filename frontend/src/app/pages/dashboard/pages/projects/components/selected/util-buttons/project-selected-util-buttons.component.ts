import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';

@Component({
  selector:        'vs-project-selected-util-buttons',
  templateUrl:     './project-selected-util-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSelectedUtilButtonsComponent {

  @Input()
  public selected: { isDefined: boolean, get: ProjectEntity };

  @Output()
  public onDelete = new EventEmitter<ProjectEntity>();

}
