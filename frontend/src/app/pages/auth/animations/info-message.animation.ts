import { animate, state, style, transition, trigger } from '@angular/animations';

export const InfoMessageAnimation = trigger('info-message', [
  state('void', style({ transform: 'translateY(-20%)', opacity: 0.0 })),
  transition(':enter', [ animate('500ms ease-in-out') ])
]);
