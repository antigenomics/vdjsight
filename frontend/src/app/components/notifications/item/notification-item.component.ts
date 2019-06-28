import { AnimationEvent } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NotificationItemAnimation, NotificationItemRemainingAnimation } from 'components/notifications/item/notification-item.animations';
import { NotificationEntity } from 'models/notifications/notifications';

type NotificationItemComponentState = 'idle' | 'highlight';

@Component({
  selector:        'div[vs-notification-item]',
  templateUrl:     './notification-item.component.html',
  styleUrls:       [ './notification-item.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ NotificationItemAnimation, NotificationItemRemainingAnimation ]
})
export class NotificationItemComponent {
  public remaining = { value: 'idle', params: { time: 0 } };

  public state: NotificationItemComponentState = 'idle';

  @Input()
  public notification: NotificationEntity;

  @Output()
  public onFocus = new EventEmitter();

  @Output()
  public onBlur = new EventEmitter();

  @Output()
  public onClose = new EventEmitter();

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  @HostListener('mouseenter')
  public mouseenter(): void {
    this.state     = 'highlight';
    this.remaining = { value: 'idle', params: { time: 0 } };
    this.onFocus.emit();
  }

  @HostListener('mouseleave')
  public mouseleave(): void {
    this.state = 'idle';
    if (this.notification.options.autoRemove) {
      this.remaining = { value: 'end', params: { time: this.notification.options.timeout } };
    }
    this.onBlur.emit();
  }

  public onNotificationAnimationDoneEvent(event: AnimationEvent): void {
    if (event.fromState === 'void' && event.phaseName === 'done') {
      this.state = 'highlight';
      setTimeout(() => {
        this.state = 'idle';
        if (this.notification.options.autoRemove) {
          this.remaining = { value: 'end', params: { time: this.notification.options.timeout } };
        }
        this.changeDetector.detectChanges();
      }, 0);
    }
  }

}
