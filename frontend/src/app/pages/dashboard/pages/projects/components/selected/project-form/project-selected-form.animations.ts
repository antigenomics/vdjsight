import { animate, state, style, transition, trigger } from '@angular/animations';

export const ProjectSelectedDescriptionAnimation = trigger('description', [
  state('transparent', style({
    'border-radius': 0,
    border:          '1px solid rgba(34, 36, 38,.0)',
    padding:         0
  })),
  state('selected', style({
    'border-radius': '.28571429rem',
    padding:         '.78571429em 1em',
    border:          '1px solid rgba(34,36,38,.15)'
  })),
  transition('* => *', [ animate('0.35s ease') ])
]);
