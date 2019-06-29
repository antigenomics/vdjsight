import { Action, TypedAction } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationsService } from 'services/notifications/notifications.service';

export interface EffectsNotificationTrigger<T extends string> {
  readonly action: TypedAction<T>;
  readonly message: string;
  readonly options?: { timeout?: number, closable?: boolean, autoRemove?: boolean };
}

export function withNotification<T extends string>(title: string,
                                                   triggers: { success?: EffectsNotificationTrigger<T>, error?: EffectsNotificationTrigger<T> },
                                                   notifications: NotificationsService) {
  return function tapNotification<A extends T>(source: Observable<Action>) {
    return source.pipe(tap((action: TypedAction<A>) => {
      if (triggers.success !== undefined && triggers.success.action.type === action.type) {
        notifications.success(title, triggers.success.message, triggers.success.options);
      } else if (triggers.error !== undefined && triggers.error.action.type === action.type) {
        notifications.error(title, triggers.error.message, triggers.error.options);
      }
    }));
  };

}
