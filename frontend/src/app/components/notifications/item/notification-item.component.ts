import { AnimationEvent } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NotificationItemAnimation, NotificationItemRemainingAnimation } from 'components/notifications/item/notification-item.animations';
import { NotificationEntity } from 'models/notifications/notifications';
import { Subject } from 'rxjs';

type NotificationItemComponentState = 'idle' | 'highlight';
type NotificationItemRemainingState = 'idle' | 'end';

@Component({
  selector:        'div[vs-notification-item]',
  templateUrl:     './notification-item.component.html',
  styleUrls:       [ './notification-item.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ NotificationItemAnimation, NotificationItemRemainingAnimation ]
})
export class NotificationItemComponent implements OnInit {
  public remaining = new Subject<{ value: NotificationItemRemainingState, params: { time: number } }>();
  public state     = new Subject<NotificationItemComponentState>();

  @Input()
  public notification: NotificationEntity;

  @Output()
  public onFocus = new EventEmitter();

  @Output()
  public onBlur = new EventEmitter();

  @Output()
  public onClose = new EventEmitter();

  public ngOnInit(): void {
    this.state.next('idle');
    this.remaining.next({ value: 'idle', params: { time: 0 } });
  }

  @HostListener('mouseenter')
  public mouseenter(): void {
    this.state.next('highlight');
    this.remaining.next({ value: 'idle', params: { time: 0 } });
    this.onFocus.emit();
  }

  @HostListener('mouseleave')
  public mouseleave(): void {
    this.state.next('idle');
    if (this.notification.options.autoRemove) {
      this.remaining.next({ value: 'end', params: { time: this.notification.options.timeout } });
    }
    this.onBlur.emit();
  }

  public onNotificationAnimationDoneEvent(event: AnimationEvent): void {
    if (event.fromState === 'void' && event.phaseName === 'done') {
      // Some bug in angular animation scheduler probably?
      // Workaround is to trigger main state animation twice after each other
      this.state.next('highlight');
      setTimeout(() => {
        this.state.next('idle');
        if (this.notification.options.autoRemove) {
          this.remaining.next({ value: 'end', params: { time: this.notification.options.timeout } });
        }
      });
    }
  }

}
