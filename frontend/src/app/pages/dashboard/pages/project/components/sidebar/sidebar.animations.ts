import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

export const LoadingLabelAnimation = trigger('loading', [
  transition(':enter', [
    style({ transform: 'translateY(-25px)' }),
    animate('750ms ease-in-out', style({ transform: 'translateY(0)' }))
  ])
]);

export const LoadFailedLabelAnimation = trigger('load-failed', [
  transition(':enter', [
    style({ height: 0, 'padding-top': 0, 'padding-bottom': 0 }),
    animate('750ms ease-in-out', style({ height: '*', 'padding-top': '1em', 'padding-bottom': '1em' }))
  ])
]);

export const SamplesListAnimation = trigger('list', [
  transition(':enter', [
    state('void', style({ opacity: 0.0 })),
    transition(':enter', [
      group([
        query('@content', animateChild(), { optional: true }),
        query(':self', [ animate('0.25s ease-in-out') ])
      ])

    ])
  ]),
  transition(':leave', [
    style({ height: '*', opacity: 1 }),
    group([
      animate('0.80s cubic-bezier(.8, -0.2, 0.2, 1.5)', style({ height: '0px' })),
      animate('0.25s ease-in-out', style({ opacity: 0 }))
    ])
  ])
]);
