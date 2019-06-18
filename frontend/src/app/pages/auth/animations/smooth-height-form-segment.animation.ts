import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const SmoothHeightFormSegmentAnimation = trigger('smoothHeightAnimation', [
  transition('void <=> *', []),
  transition('* <=> *', [
    style({ height: '{{startFrom}}px' }),
    group([
      animate('500ms ease'),
      query('@error-message', animateChild({ duration: '500ms ease' }), { optional: true }),
      query('@success-message', animateChild({ duration: '500ms ease' }), { optional: true })
    ])
  ], { params: { startFrom: 0 } })
]);
