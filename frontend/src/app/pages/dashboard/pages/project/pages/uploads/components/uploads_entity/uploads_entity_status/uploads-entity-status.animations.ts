import { animate, style, transition, trigger } from '@angular/animations';

export const WarningAnimation = trigger('warning', [
  transition(':enter', [
    style({ opacity: 0.0 }),
    animate('500ms', style({ opacity: 1.0 }))
  ])
]);

export const ErrorAnimation = trigger('error', [
  transition(':enter', [
    style({ opacity: 0.0 }),
    animate('500ms', style({ opacity: 1.0 }))
  ])
]);

export const ProgressAnimation = trigger('progress', [
  transition(':enter', [
    style({ opacity: 0.0 }),
    animate('500ms', style({ opacity: 1.0 }))
  ])
]);

export const ProgressBarAnimation = trigger('progress-bar', [
  transition('* => *', [
    animate('100ms', style({ width: '{{ width }}% ' }))
  ])
]);
