import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorMessageAnimation } from 'pages/auth/animations/error-message.animation';
import { FormFooterAnimation } from 'pages/auth/animations/form-footer.animation';
import { SmoothHeightFormSegmentAnimation } from 'pages/auth/animations/smooth-height-form-segment.animation';
import { AuthForms } from 'pages/auth/auth.forms';

@Component({
  selector:        'vs-signup',
  templateUrl:     './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ErrorMessageAnimation, SmoothHeightFormSegmentAnimation, FormFooterAnimation ]
})
export class SignupComponent {
  @Input()
  public pending: boolean;

  @Input()
  public error?: string;

  @Input()
  public extra?: string[];

  @Output()
  public onSubmit = new EventEmitter<AuthForms.SignupForm>();
}
