import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FadeInAnimation } from 'animations/fade-in.animation';
import { EntityStatus } from 'utils/state/entity';

@Component({
  selector:        'vs-sidebar-sample-utils-delete',
  templateUrl:     './sidebar-sample-utils-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FadeInAnimation ]
})
export class SidebarSampleUtilsDeleteComponent {
  @Input()
  public deleting: EntityStatus;

  @Output()
  public onDelete = new EventEmitter();
}
