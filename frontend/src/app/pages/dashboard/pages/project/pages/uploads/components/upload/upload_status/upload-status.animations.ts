import { animate, style, transition, trigger } from '@angular/animations';

export const WarningAnimation = trigger('warning', [
  transition(':enter', [
    style({ opacity: 0.0 }),
    animate('500ms', style({ opacity: 1.0 }))
  ])
]);

export const ProgressBarAnimation = trigger('progress', [
  transition(':enter', [
    style({ opacity: 0.0 }),
    animate('500ms', style({ opacity: 1.0 }))
  ])
]);
