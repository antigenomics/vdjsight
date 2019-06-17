import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthPagesModuleState } from 'pages/auth/models/auth-pages.state';
import { LoginPageActions } from 'pages/auth/models/login_page/login-page.actions';

@Component({
  selector:        'vs-login-form',
  templateUrl:     './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {

  constructor(private readonly store: Store<AuthPagesModuleState>) {}

  public login(): void {
    this.store.dispatch(LoginPageActions.loginAttempt({ form: { email: 'bvd@a', password: '123123' } }));
  }
}
