import { animate, state, style, transition, trigger } from '@angular/animations';

export const FadeInAnimation = trigger('fade-in', [
  state('void', style({ opacity: 0.0 })),
  transition(':enter', [ animate('0.5s ease-in-out', style({ opacity: 1.0 })) ])
]);
