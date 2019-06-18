import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorMessageAnimation } from 'pages/auth/animations/error-message.animation';
import { InfoMessageAnimation } from 'pages/auth/animations/info-message.animation';
import { SmoothHeightFormSegmentAnimation } from 'pages/auth/animations/smooth-height-form-segment.animation';
import { AuthForms } from 'pages/auth/auth.forms';

@Component({
  selector:        'vs-login',
  templateUrl:     './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ InfoMessageAnimation, ErrorMessageAnimation, SmoothHeightFormSegmentAnimation ]
})
export class LoginComponent {
  @Input()
  public pending: boolean;

  @Input()
  public message?: string;

  @Input()
  public error: string;

  @Input()
  public extra?: string[];

  @Output()
  public onSubmit = new EventEmitter<AuthForms.LoginForm>();
}
