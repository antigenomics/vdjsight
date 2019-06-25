import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';

export const SmoothHeightAnimation = trigger('smoothHeightAnimation', [
  transition('void <=> *', []),
  transition('* <=> *', [
      style({ height: '{{startFrom}}px' }),
      animate('0.35s ease'),
      query(':enter', animateChild({ duration: '0.35 ease' }), { optional: true })
    ],
    {
      params: { startFrom: 0 }
    })
]);
