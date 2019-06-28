import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationListAnimation } from 'components/notifications/notifications.animations';

@Component({
  selector:        'vs-notifications',
  templateUrl:     './notifications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ NotificationListAnimation ]
})
export class NotificationsComponent {}
