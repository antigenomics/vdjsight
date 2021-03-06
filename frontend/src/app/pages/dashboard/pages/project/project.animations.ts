import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

export const SidebarAnimation = trigger('sidebar', [
  state('hidden', style({ width: '2.5%' })),
  transition(':enter', [
    style({ opacity: 0.0, transform: 'translateX(-25px)' }),
    group([
      animate('1.00s ease-in-out', style({ transform: 'translateX(0)' })),
      animate('1.00s ease-in-out', style({ opacity: 1.0 })),
      query('@list', animateChild(), { optional: true }),
      query('@content', animateChild(), { optional: true })
    ])
  ])
]);

export const ContentAnimation = trigger('content', [
  transition(':enter', [
    style({ opacity: 0.0, transform: 'translateY(25px)' }),
    group([
      animate('1.00s ease-in-out', style({ transform: 'translateY(0)' })),
      animate('1.00s ease-in-out', style({ opacity: 1.0 }))
    ])
  ])
]);
