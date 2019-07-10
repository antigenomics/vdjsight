import { animate, style, transition, trigger } from '@angular/animations';

export const LoadingLabelAnimation = trigger('loading', [
  transition(':enter', [
    style({ transform: 'translateY(-25px)' }),
    animate('750ms ease-in-out', style({ transform: 'translateY(0)' }))
  ])
]);

export const LoadFailedLabelAnimation = trigger('load-failed', [
  transition(':enter', [
    style({ height: 0, 'padding-top': 0, 'padding-bottom': 0 }),
    animate('750ms ease-in-out', style({ height: '*', 'padding-top': '1em', 'padding-bottom': '1em' }))
  ])
]);
