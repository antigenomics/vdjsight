import { animate, group, style, transition, trigger } from '@angular/animations';

export const ProjectsFooterAnimation = trigger('footer', [
  transition(':enter', [
    style({ 'padding-top': 0, 'padding-bottom': 0, height: 0, opacity: 0.0 }),
    group([
      animate('500ms ease-in-out', style({ opacity: 1.0 })),
      animate('350ms ease-in-out', style({ 'padding-top': '*', 'padding-bottom': '*', height: '*' }))
    ])
  ]),
  transition(':leave', [
    group([
      animate('350ms ease-in-out', style({ opacity: 0.0 })),
      animate('500ms ease-in-out', style({ 'padding-top': 0, 'padding-bottom': 0, height: 0 }))
    ])
  ])
]);
