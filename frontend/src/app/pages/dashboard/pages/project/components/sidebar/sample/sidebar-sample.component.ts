import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { ContentAnimation, SampleAnimation, UtilsAnimation } from 'pages/dashboard/pages/project/components/sidebar/sample/sidebar-sample.animations';
import { ReplaySubject, Subject } from 'rxjs';
import { FadeInAnimation } from 'animations/fade-in.animation';

const enum SampleEntityState {
  NOTHING   = 'nothing',
  HIGHLIGHT = 'highlight',
  SELECTED  = 'selected',
  DELETING  = 'deleting',
  UPDATING  = 'updating'
}

@Component({
  selector:        'vs-sidebar-sample',
  templateUrl:     './sidebar-sample.component.html',
  styleUrls:       [ './sidebar-sample.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ContentAnimation, SampleAnimation, UtilsAnimation, SmoothHeightAnimation, FadeInAnimation ]
})
export class SidebarSampleComponent implements OnInit, OnChanges {
  public state: Subject<SampleEntityState> = new ReplaySubject();

  @Input()
  public sample: SampleEntity;

  @Input()
  public isSelected: boolean;

  @Output()
  public onSelect = new EventEmitter();

  @Output()
  public onDelete = new EventEmitter();

  @HostListener('mouseenter')
  public mouseenter(): void {
    this.updateState(SampleEntityState.HIGHLIGHT);
  }

  @HostListener('mouseleave')
  public mouseleave(): void {
    this.updateState(SampleEntityState.NOTHING);
  }

  public ngOnInit(): void {
    this.updateState(SampleEntityState.NOTHING);
  }

  public ngOnChanges(): void {
    this.updateState(SampleEntityState.NOTHING);
  }

  private updateState(fallback: SampleEntityState): void {
    const s = (() => {
      if (this.sample.deleting.active) {
        return SampleEntityState.DELETING;
      } else if (this.sample.updating.active) {
        return SampleEntityState.UPDATING;
      } else if (this.isSelected) {
        return SampleEntityState.SELECTED;
      } else {
        return fallback;
      }
    })();
    this.state.next(s);
  }
}
