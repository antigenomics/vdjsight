import { AbstractControl, ValidationErrors } from '@angular/forms';

export function EqualPasswordsValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value.password1 !== '' && control.value.password2 !== '' && control.value.password1 !== control.value.password2) {
    return { equalPasswords: true };
  } else {
    return null; // tslint:disable-line:no-null-keyword
  }
}
