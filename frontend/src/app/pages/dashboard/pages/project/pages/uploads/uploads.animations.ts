import { animate, group, query, stagger, style, transition, trigger } from '@angular/animations';

export const UploadsListAnimation = trigger('uploads', [
  transition('* <=> *', [
    query(':enter', [
      style({ height: 0, opacity: 0, transform: 'translateX(25px)' }),
      stagger('50ms',
        group([
          animate('200ms ease-in-out', style({ height: '*' })),
          animate('400ms 200ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ])
      )
    ], { optional: true }),
    query(':leave', [
      style({ height: '*', opacity: 1.0 }),
      animate('400ms ease-in-out', style({ opacity: 0, transform: 'translateX(25px)' })),
      animate('200ms ease-in-out', style({ height: 0 }))
    ], { optional: true })
  ])
]);

export const EmptyListNoteAnimation = trigger('empty', [
  transition(':enter', [
    style({ height: 0, opacity: 0, 'min-height': 0, padding: 0 }),
    group([
      animate('0.5s ease-in-out', style({ height: '*', opacity: 1, 'min-height': '*', padding: '*' }))
    ])
  ]),
  transition(':leave', [
    group([
      animate('250ms ease-in-out', style({ opacity: 0 })),
      animate('450ms ease-in-out', style({ height: 0, 'min-height': 0, padding: 0 }))
    ])
  ])
]);

export const UploadsErrorsAnimation = trigger('errors', [
  transition(':enter', [
    style({ height: 0, 'padding-top': 0, 'padding-bottom': 0, opacity: 0 }),
    animate('300ms 50ms', style({ height: '*', 'padding-top': '*', 'padding-bottom': '*', opacity: 1.0 }))
  ]),
  transition(':leave', [
    animate('300ms 50ms', style({ height: 0, 'padding-top': 0, 'padding-bottom': 0, opacity: 0 }))
  ])
]);

export const UploadsWarningsAnimation = trigger('warnings', [
  transition(':enter', [
    style({ height: 0, 'padding-top': 0, 'padding-bottom': 0, opacity: 0 }),
    animate('300ms 50ms', style({ height: '*', 'padding-top': '*', 'padding-bottom': '*', opacity: 1.0 }))
  ]),
  transition(':leave', [
    animate('300ms 50ms', style({ height: 0, 'padding-top': 0, 'padding-bottom': 0, opacity: 0 }))
  ])
]);
