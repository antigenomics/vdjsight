import { animate, style, transition, trigger } from '@angular/animations';

export const FlickerAnimation = trigger('flicker', [
  transition('* => *', [
    style({ opacity: 0.0 }),
    animate('0.75s ease-in-out', style({ opacity: 1.0 }))
  ])
]);
