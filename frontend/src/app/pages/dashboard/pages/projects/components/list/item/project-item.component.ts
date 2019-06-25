import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, HostListener, OnChanges } from '@angular/core';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';
import { ProjectItemMainAnimation, ProjectItemUtilAnimation } from 'pages/dashboard/pages/projects/components/list/item/project-item.animation';

@Component({
  selector:        'div[vs-project-item]',
  templateUrl:     './project-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ProjectItemMainAnimation, ProjectItemUtilAnimation ]
})
export class ProjectItemComponent implements OnChanges {
  @Input()
  public project: ProjectEntity;

  @Input()
  public isHighlighted: boolean;

  @Output()
  public onDelete = new EventEmitter();

  @Output()
  public onHighlight = new EventEmitter();

  public state: 'nothing' | 'highlight' = 'nothing';

  @HostListener('mouseenter')
  public mouseenter(): void {
    this.state = 'highlight';
  }

  @HostListener('mouseleave')
  public mouseleave(): void {
    this.state = this.isHighlighted ? 'highlight' : 'nothing';
  }

  @HostListener('click')
  public click(): void {
    this.onHighlight.emit();
  }

  public ngOnChanges(): void {
    this.state = this.isHighlighted ? 'highlight' : 'nothing';
  }
}
