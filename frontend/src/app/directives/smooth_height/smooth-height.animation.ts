import { animate, animateChild, query, style, transition, trigger } from '@angular/animations';

export const SmoothHeightAnimation = trigger('smoothHeightAnimation', [
  transition('void <=> *', []),
  transition('* <=> *', [
      style({ height: '{{startFrom}}px' }),
      animate('{{ time }}ms ease'),
      query(':enter', animateChild({ duration: '{{ time }}ms ease' }), { optional: true })
    ],
    {
      params: { startFrom: 0 }
    })
]);
