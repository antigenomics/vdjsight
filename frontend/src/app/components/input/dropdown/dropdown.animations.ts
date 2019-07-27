import { animate, style, transition, trigger } from '@angular/animations';

export const DropdownAnimation = trigger('dropdown', [
  transition(':enter', [
    style({ height: '0', overflow: 'hidden' }),
    animate('200ms', style({ height: '*' })),
    style({ overflow: '*' })
  ]),
  transition(':leave', [
    style({ overflow: 'hidden' }),
    animate('100ms', style({ height: 0 })),
    style({ overflow: '*' })
  ])
]);
