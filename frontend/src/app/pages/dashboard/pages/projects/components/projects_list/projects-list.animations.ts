import { animate, group, state, style, transition, trigger } from '@angular/animations';

export const ProjectsListAnimation = trigger('list', [
  transition(':enter', [
    state('void', style({ opacity: 0.0 })),
    transition(':enter', [ animate('0.5s ease-in-out') ])
  ]),
  transition(':leave', [
    style({ height: '*', opacity: 1 }),
    group([
      animate('0.80s cubic-bezier(.8, -0.2, 0.2, 1.5)', style({ height: '0px' })),
      animate('0.25s ease-in-out', style({ opacity: 0 }))
    ])
  ])
]);
