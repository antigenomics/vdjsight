import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { FlickerAnimation } from 'animations/flicker.animation';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { ContentAnimation, ProjectAnimation, ProjectSmoothHeightAnimation } from 'pages/dashboard/pages/projects/components/list/item/project-item.animation';

type ProjectItemState = 'nothing' | 'highlight' | 'selected' | 'deleting' | 'updating';

@Component({
  selector:        'div[vs-project-item]',
  templateUrl:     './project-item.component.html',
  styleUrls:       [ './project-item.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ContentAnimation, ProjectAnimation, ProjectSmoothHeightAnimation, FlickerAnimation ]
})
export class ProjectItemComponent implements OnChanges {
  @Input()
  public project: ProjectEntity;

  @Input()
  public isSelected: boolean;

  @Output()
  public onSelect = new EventEmitter();

  @Output()
  public onDelete = new EventEmitter();

  public state: ProjectItemState = 'nothing';

  @HostListener('mouseenter')
  public mouseenter(): void {
    this.state = this._state('highlight');
  }

  @HostListener('mouseleave')
  public mouseleave(): void {
    this.state = this._state('nothing');
  }

  public ngOnChanges(): void {
    this.state = this._state('nothing');
  }

  public select(event: Event) {
    event.stopPropagation();
    this.onSelect.emit();
  }

  public delete(event: Event) {
    event.stopPropagation();
    this.onDelete.emit();
  }

  private _state(fallback: ProjectItemState): ProjectItemState {
    if (this.project.isDeleting) {
      return 'deleting';
    } else if (this.project.isUpdating) {
      return 'updating';
    } else if (this.isSelected) {
      return 'selected';
    } else {
      return fallback;
    }
  }
}
