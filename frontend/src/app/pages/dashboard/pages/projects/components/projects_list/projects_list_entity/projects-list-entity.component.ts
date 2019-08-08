import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FlickerAnimation } from 'animations/flicker.animation';
import { ProjectEntity } from 'pages/dashboard/models/projects/projects';
import {
  ContentAnimation,
  ProjectAnimation,
  ProjectSmoothHeightAnimation
} from 'pages/dashboard/pages/projects/components/projects_list/projects_list_entity/projects-list-entity.animation';
import { ReplaySubject, Subject } from 'rxjs';

const enum ProjectEntityState {
  NOTHING   = 'nothing',
  HIGHLIGHT = 'highlight',
  SELECTED  = 'selected',
  DELETING  = 'deleting',
  UPDATING  = 'updating'
}

@Component({
  selector:        'div[vs-projects-list-entity]',
  templateUrl:     './projects-list-entity.component.html',
  styleUrls:       [ './projects-list-entity.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ContentAnimation, ProjectAnimation, ProjectSmoothHeightAnimation, FlickerAnimation ]
})
export class ProjectsListEntityComponent implements OnInit, OnChanges {
  public state: Subject<ProjectEntityState> = new ReplaySubject();

  @Input()
  public project: ProjectEntity;

  @Input()
  public isSelected: boolean;

  @Output()
  public onSelect = new EventEmitter();

  @Output()
  public onFailedDiscard = new EventEmitter();

  @HostListener('mouseenter')
  public mouseenter(): void {
    this.updateState(ProjectEntityState.HIGHLIGHT);
  }

  @HostListener('mouseleave')
  public mouseleave(): void {
    this.updateState(ProjectEntityState.NOTHING);
  }

  public ngOnInit(): void {
    this.updateState(ProjectEntityState.NOTHING);
  }

  public ngOnChanges(): void {
    this.updateState(ProjectEntityState.NOTHING);
  }

  private updateState(fallback: ProjectEntityState): void {
    const s = (() => {
      if (this.project.deleting.active) {
        return ProjectEntityState.DELETING;
      } else if (this.project.updating.active) {
        return ProjectEntityState.UPDATING;
      } else if (this.isSelected) {
        return ProjectEntityState.SELECTED;
      } else {
        return fallback;
      }
    })();
    this.state.next(s);
  }
}
