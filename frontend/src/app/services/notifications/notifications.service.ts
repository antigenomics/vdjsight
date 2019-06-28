import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CreateNotificationEntity, NotificationEntityOptions, NotificationType } from 'models/notifications/notifications';
import { NotificationActions } from 'models/notifications/notifications.actions';
import { RootModuleState } from 'models/root';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private readonly store: Store<RootModuleState>) {}

  public notification(title: string, content: string, options: Partial<NotificationEntityOptions>): void {
    this.store.dispatch(NotificationActions.create({
      entity: CreateNotificationEntity(title, content, options)
    }));
  }

  public info(title: string, content: string, options?: { timeout?: number, closable?: boolean, autoRemove?: boolean }): void {
    this.notification(title, content, { type: NotificationType.INFO, ...options });
  }

  public success(title: string, content: string, options?: { timeout?: number, closable?: boolean, autoRemove?: boolean }): void {
    this.notification(title, content, { type: NotificationType.SUCCESS, ...options });
  }

  public warning(title: string, content: string, options?: { timeout?: number, closable?: boolean, autoRemove?: boolean }): void {
    this.notification(title, content, { type: NotificationType.WARNING, ...options });
  }

  public error(title: string, content: string, options?: { timeout?: number, closable?: boolean, autoRemove?: boolean }): void {
    this.notification(title, content, { type: NotificationType.ERROR, ...options });
  }

}
