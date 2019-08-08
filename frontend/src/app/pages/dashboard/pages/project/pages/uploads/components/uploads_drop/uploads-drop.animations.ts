import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

export const DropAreaAnimation = trigger('area', [
  state('inactive', style({ 'background-color': '#ffffff' })),
  state('active', style({ 'background-color': '#f3f4f5' })),
  transition('active => inactive', [
    group([
      query('@helper', animateChild(), { optional: true }),
      animate('200ms ease-in-out')
    ])
  ]),
  transition('inactive => active', [
    group([
      query('@helper', animateChild(), { optional: true }),
      animate('200ms ease-in-out')
    ])
  ])
]);

export const DropHelperAnimation = trigger('helper', [
  state('inactive', style({ opacity: 0.0 })),
  state('active', style({ opacity: 0.9 })),
  transition('active => inactive', [
    animate('200ms ease-in-out')
  ]),
  transition('inactive => active', [
    animate('200ms ease-in-out')
  ])
]);
