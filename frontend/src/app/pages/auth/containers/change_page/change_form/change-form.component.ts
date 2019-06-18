import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmoothHeightAnimation } from 'directives/smooth_height/smooth-height.animation';
import { ErrorLabelAnimation } from 'pages/auth/animations/error-label.animation';
import { ErrorMessageAnimation } from 'pages/auth/animations/error-message.animation';
import { AuthForms } from 'pages/auth/auth.forms';
import { EqualPasswordsValidator } from 'pages/auth/validators/equal-passwords.validator';

@Component({
  selector:        'vs-change-form',
  templateUrl:     './change-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SmoothHeightAnimation, ErrorLabelAnimation, ErrorMessageAnimation ]
})
export class ChangeFormComponent {

  @Output()
  public onSubmit = new EventEmitter<AuthForms.ChangeForm>();

  public form: FormGroup;

  public get c() {
    return this.form.controls;
  }

  constructor(readonly fb: FormBuilder) {
    this.form = fb.group({
      password1: [ '', Validators.required ],
      password2: [ '', Validators.required ]
    }, { validators: EqualPasswordsValidator });
  }

  public submit(): void {
    this.onSubmit.emit(this.form.value);
  }

}
