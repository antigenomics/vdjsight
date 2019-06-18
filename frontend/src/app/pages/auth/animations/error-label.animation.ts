import { animate, state, style, transition, trigger } from '@angular/animations';

export const ErrorLabelAnimation = trigger('label', [
  state('void', style({ transform: 'translateX(-5%)', opacity: 0.0 })),
  transition(':enter', [ animate('0.5s ease-in-out') ])
]);
