import { animate, state, style, transition, trigger } from '@angular/animations';

export const ProjectItemUtilAnimation = trigger('project-util', [
  state('void', style({ opacity: 0.0 })),
  transition(':enter', [ animate('0.5s ease-in-out') ])
]);

export const ProjectItemMainAnimation = trigger('project-item', [
  state('void', style({ transform: 'translateX(-5%)', opacity: 1.0 })),
  state('highlight', style({ 'margin-left': '0.75em' })),
  transition(':enter', [ animate('0.5s ease-in-out') ]),
  transition('* => highlight', [ animate('0.25s ease-in-out') ]),
  transition('highlight => *', [ animate('0.25s ease-in-out') ])
]);
