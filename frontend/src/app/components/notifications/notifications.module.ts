import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationItemComponent } from 'components/notifications/item/notification-item.component';
import { NotificationsComponent } from 'components/notifications/notifications.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ NotificationsComponent, NotificationItemComponent ],
  exports:      [ NotificationsComponent ]
})
export class NotificationsModule {}
