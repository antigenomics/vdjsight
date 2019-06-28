import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotificationsComponent } from 'components/notifications/notifications.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ NotificationsComponent ],
  exports:      [ NotificationsComponent ]
})
export class NotificationsModule {}
