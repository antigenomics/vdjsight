import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { NotificationsEffects } from 'models/notifications/notifications.effects';

export const NotificationListAnimation = trigger('notifications', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(50px)' }),
      stagger('100ms',
        animate(
          `${NotificationsEffects.NotificationScheduleRemoveDelay}ms cubic-bezier(0.5, -0.5, 0.3, 1.4)`,
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      )
    ], { optional: true }),
    query(':leave', [
      stagger('10ms', animate('400ms cubic-bezier(0.5, -0.5, 0.3, 1.4)', style({ opacity: 0, transform: 'translateX(50px)' })))
    ], { optional: true })
  ])
]);
