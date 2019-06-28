import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

export const NotificationItemAnimation = trigger('notification', [
  state('void', style({ transform: 'scale(1.00)', 'box-shadow': '1px 7px 14px -5px rgba(0, 0, 0, 0.2)' })),
  state('idle', style({ transform: 'scale(1.00)', 'box-shadow': '1px 7px 14px -5px rgba(0, 0, 0, 0.2)' })),
  state('highlight', style({ transform: 'scale(1.05)', 'box-shadow': '2px 14px 28px -10px rgba(0, 0, 0, 0.6)' })),
  transition(':enter', [ animate('0.0s') ]),
  transition('* => highlight', [
    group([
      query('@remaining', animateChild()),
      query(':self', animate('0.25s ease-in-out'))

    ])
  ]),
  transition('* => idle', [
    group([
      query('@remaining', animateChild()),
      query(':self', animate('0.25s ease-in-out'))
    ])
  ])
]);

export const NotificationItemRemainingAnimation = trigger('remaining', [
  state('void', style({ width: '0%' })),
  state('idle', style({ width: '100%' })),
  state('end', style({ width: '0%' })),
  transition(':enter', [ animate('0.0s') ]),
  transition('* => end', [ animate('{{ time }}ms linear') ]),
  transition('* => idle', [ animate('0s') ])
]);
