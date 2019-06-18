import { animate, state, style, transition, trigger } from '@angular/animations';

export const FormEnterAnimation = trigger('form-enter', [
  state('void', style({ transform: 'translateY(-5%)', opacity: 0.0 })),
  transition(':enter', [ animate('500ms ease-in-out') ])
]);
