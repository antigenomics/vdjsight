import { animate, group, style, transition, trigger } from '@angular/animations';

export const LoadingContentAnimation = trigger('loading', [
  transition(':enter', [
    style({ opacity: 0.0, transform: 'translateY(25px)' }),
    group([
      animate('500ms 500ms ease-in-out', style({ transform: 'translateY(0)' })),
      animate('500ms 500ms ease-in-out', style({ opacity: 1.0 }))
    ])
  ])
]);
