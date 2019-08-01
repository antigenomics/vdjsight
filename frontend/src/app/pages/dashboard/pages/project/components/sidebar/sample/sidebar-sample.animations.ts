import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

export const ContentAnimation = trigger('content', [
  state('void', style({ transform: 'translateX(-5%)', opacity: 0.0, 'border-left': '0 solid #ffffff' })),
  state('nothing', style({ 'border-left': '0px solid #e6e6e6', background: '#ffffff' })),
  state('highlight', style({ 'border-left': '0.5em solid #e6e6e6', background: 'rgba(243, 244, 245, .5)' })),
  state('selected', style({ 'border-left': '0.5em solid #6baed6', background: 'rgba(243, 244, 245, .5)' })),
  state('deleting', style({ 'border-left': '0.5em solid #e34a33', background: 'rgba(243, 244, 245, .5)', opacity: 0.4 })),
  state('updating', style({ 'border-left': '0.5em solid #fdcc8a', background: 'rgba(243, 244, 245, .5)', opacity: 0.4 })),
  transition(':enter', [ animate('0.5s ease-in-out') ]),
  transition(':leave', [ animate('0.5s ease-in-out', style({ height: 0, opacity: 0.0 })) ]),
  transition('* => *', [
    group([
      query('@sample', animateChild(), { optional: true }),
      query(':self', [ animate('0.25s ease-in-out') ])
    ])
  ])
]);

export const SampleAnimation = trigger('sample', [
  state('void', style({ opacity: 0.0 })),
  state('nothing', style({ 'padding-right': '1em' })),
  state('highlight', style({ 'padding-right': '0.5em' })),
  state('selected', style({ 'padding-right': '0.5em' })),
  state('deleting', style({ 'padding-right': '0.5em' })),
  state('updating', style({ 'padding-right': '0.5em' })),
  transition('* => *', [
    group([
      query('@utils', animateChild(), { optional: true }),
      query(':self', [ animate('0.25s ease-in-out') ])
    ])
  ])
]);

export const UtilsAnimation = trigger('utils', [
  state('void', style({ opacity: 0.0 })),
  state('nothing', style({ 'padding-right': '0em', opacity: 0.0 })),
  state('highlight', style({ 'padding-right': '0.5em', opacity: 1.0 })),
  state('selected', style({ 'padding-right': '0.5em', opacity: 1.0 })),
  state('deleting', style({ 'padding-right': '0.5em', opacity: 1.0 })),
  state('updating', style({ 'padding-right': '0.5em', opacity: 1.0 })),
  transition('* => *', [ animate('0.25s ease-in-out') ])
]);
