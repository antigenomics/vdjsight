import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

export const DropdownAnimation = trigger('dropdown', [
  state('active', style({
    'border-color':               '#96c8da',
    'box-shadow':                 '0 2px 3px 0 rgba(34,36,38,.15)',
    'border-bottom-left-radius':  0,
    'border-bottom-right-radius': 0,
    'z-index':                    11
  })),
  state('inactive', style({
    'z-index': 1
  })),
  transition('inactive => active', [
    style({ 'z-index': 11 }),
    group([
      query('@list', animateChild(), { optional: true }),
      query('@icon', animateChild(), { optional: true }),
      animate('150ms')
    ])
  ]),
  transition('active => inactive', [
    style({ 'z-index': 11 }),
    group([
      query('@list', animateChild(), { optional: true }),
      query('@icon', animateChild(), { optional: true })
    ]),
    animate('50ms'),
    style({ 'z-index': 1 })
  ])
]);

export const DropdownIconAnimation = trigger('icon', [
  state('active', style({ transform: 'rotate(90deg)' })),
  state('inactive', style({ transform: 'rotate(0deg)' })),
  transition('* <=> *', [
    animate('250ms')
  ])
]);

export const DropdownListAnimation = trigger('list', [
  state('void', style({
    visibility: 'hidden',
    overflow:   'hidden'
  })),
  state('inactive', style({
    visibility: 'hidden',
    overflow:   'hidden'
  })),
  state('active', style({
    'border-color': '#96c8da',
    'box-shadow':   '0 2px 3px 0 rgba(34,36,38,.15)',
    visibility:     'visible',
    overflow:       'auto'
  })),
  transition('inactive => active', [
    style({ height: '0', overflow: 'hidden', visibility: 'visible' }),
    animate('250ms ease-in-out', style({
      height:         '*',
      'border-color': '#96c8da',
      'box-shadow':   '0 2px 3px 0 rgba(34,36,38,.15)'
    })),
    style({ overflow: '*', visibility: 'visible' })
  ]),
  transition('active => inactive', [
    style({ overflow: 'hidden' }),
    animate('250ms ease-in-out', style({ height: 0 })),
    style({ overflow: '*', visibility: 'hidden' })
  ])
]);
