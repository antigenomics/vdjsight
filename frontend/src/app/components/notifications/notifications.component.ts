import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NotificationListAnimation } from 'components/notifications/notifications.animations';
import { NotificationEntity } from 'models/notifications/notifications';
import { NotificationActions } from 'models/notifications/notifications.actions';
import { fromRoot, RootModuleState } from 'models/root';

@Component({
  selector:        'vs-notifications',
  templateUrl:     './notifications.component.html',
  styleUrls:       [ './notifications.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ NotificationListAnimation ]
})
export class NotificationsComponent {
  public readonly notifications$ = this.store.pipe(select(fromRoot.getAllNotification));

  constructor(private readonly store: Store<RootModuleState>) {}

  public trackNotificationBy(_: number, notification: NotificationEntity) {
    return notification.id;
  }

  public focus(entity: NotificationEntity): void {
    if (entity.scheduled) {
      this.store.dispatch(NotificationActions.cancelScheduledRemove({ entity }));
    }
  }

  public blur(entity: NotificationEntity): void {
    if (entity.options.autoRemove) {
      this.store.dispatch(NotificationActions.scheduleRemove({ entity }));
    }
  }

  public remove(entity: NotificationEntity): void {
    this.store.dispatch(NotificationActions.remove({ entity }));
  }
}
