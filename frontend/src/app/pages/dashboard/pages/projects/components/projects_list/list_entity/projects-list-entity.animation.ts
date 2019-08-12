import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

export const ContentAnimation = trigger('content', [
  state('void', style({ transform: 'translateX(-5%)', opacity: 0.0, 'border-left': '0 solid #ffffff' })),
  state('nothing', style({ 'border-left': '0 solid #ffffff', background: '#ffffff' })),
  state('highlight', style({ 'border-left': '0.5em solid #e6e6e6', background: 'rgba(243, 244, 245, .5)' })),
  state('preview', style({ 'border-left': '0.5em solid #9e9ac8', background: 'rgba(243, 244, 245, .5)' })),
  state('deleting', style({ 'border-left': '0.5em solid #e34a33', background: 'rgba(243, 244, 245, .5)', opacity: 0.4 })),
  state('updating', style({ 'border-left': '0.5em solid #fdcc8a', background: 'rgba(243, 244, 245, .5)', opacity: 0.4 })),
  transition(':enter', [ animate('0.5s ease-in-out') ]),
  transition(':leave', [ animate('0.5s ease-in-out', style({ height: 0, opacity: 0.0 })) ]),
  transition('* => *', [
    group([
      query('@project', animateChild(), { optional: true }),
      query(':self', [ animate('0.25s ease-in-out') ])
    ])
  ])
]);

export const ProjectAnimation = trigger('project', [
  state('void', style({ opacity: 0.0 })),
  state('nothing', style({ padding: '2em', 'padding-right': '2em' })),
  state('highlight', style({ 'padding-right': '1.5em' })),
  state('preview', style({ 'padding-right': '1.5em' })),
  state('deleting', style({ 'padding-right': '1.5em' })),
  state('updating', style({ 'padding-right': '1.5em' })),
  transition('* => *', [ animate('0.25s ease-in-out') ])
]);

export const ProjectSmoothHeightAnimation = trigger('smoothHeightAnimation', [
  transition('void <=> *', []),
  transition('* <=> *', [
      group([
        group([
          style({ height: '{{startFrom}}px' }),
          animate('0.35s ease'),
          query(':enter', animateChild({ duration: '0.35 ease' }), { optional: true })
        ]),
        query('@content', animateChild(), { optional: true }),
        query('@flicker', animateChild(), { optional: true })
      ])
    ],
    {
      params: { startFrom: 0 }
    })
]);
