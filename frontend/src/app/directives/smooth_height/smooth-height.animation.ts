import { animate, style, transition, trigger } from '@angular/animations';

export const SmoothHeightAnimation = trigger('smoothHeightAnimation', [
  transition('void <=> *', []),
  transition('* <=> *', [ style({ height: '{{startFrom}}px' }), animate('0.35s ease') ], {
    params: { startFrom: 0 }
  })
]);
