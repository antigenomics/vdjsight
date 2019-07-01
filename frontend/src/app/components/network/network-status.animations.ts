import { animate, style, transition, trigger } from '@angular/animations';

export const BackgroundFade = trigger('background', [
  transition(':enter', [
    style({ opacity: 0.0 }),
    animate('200ms ease-in-out', style({ opacity: 0.75 }))
  ]),
  transition(':leave', [
    style({ opacity: 0.75 }),
    animate('200ms ease-in-out', style({ opacity: 0.0 }))
  ])
]);

export const NetworkStatusPopup = trigger('status', [
  transition(':enter', [
    style({ transform: 'translateY(-100px)' }),
    animate('250ms ease-in-out', style({ transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0)' }),
    animate('250ms ease-in-out', style({ transform: 'translateY(-100px)' }))
  ])
]);
