import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { ErrorLabelAnimation } from 'pages/auth/animations/error-label.animation';
import { ErrorMessageAnimation } from 'pages/auth/animations/error-message.animation';
import { AuthForms } from 'pages/auth/auth.forms';

@Component({
  selector:        'vs-login-form',
  templateUrl:     './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation, ErrorLabelAnimation, ErrorMessageAnimation ]
})
export class LoginFormComponent {

  @Output()
  public onSubmit = new EventEmitter<AuthForms.LoginForm>();

  public form: FormGroup;

  public get c() {
    return this.form.controls;
  }

  constructor(readonly fb: FormBuilder) {
    this.form = fb.group({
      email:    [ '', Validators.compose([ Validators.email, Validators.required ]) ],
      password: [ '', Validators.required ]
    });
  }

  public submit(): void {
    this.onSubmit.emit(this.form.value);
  }

}
