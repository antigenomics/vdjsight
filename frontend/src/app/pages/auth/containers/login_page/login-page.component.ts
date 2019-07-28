import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { FormEnterAnimation } from 'pages/auth/animations/form-enter.animation';
import { AuthForms } from 'pages/auth/auth.forms';
import { AuthPagesModuleState, fromAuth } from 'pages/auth/models/auth-pages.state';
import { LoginPageActions } from 'pages/auth/models/login_page/login-page.actions';

@Component({
  selector:        'vs-login-page',
  templateUrl:     './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FormEnterAnimation ]
})
export class LoginPageComponent implements OnInit {
  public readonly pending$ = this.store.pipe(select(fromAuth.isLoginPagePending));
  public readonly message$ = this.store.pipe(select(fromAuth.getLoginPageMessage));
  public readonly error$   = this.store.pipe(select(fromAuth.getLoginPageError));
  public readonly extra$   = this.store.pipe(select(fromAuth.getLoginPageExtra));

  constructor(private readonly store: Store<AuthPagesModuleState>, private readonly title: Title) {}

  public ngOnInit(): void {
    this.title.setTitle('VDJsight: Login');
    this.store.dispatch(LoginPageActions.init());
  }

  public onSubmit(form: AuthForms.LoginForm): void {
    this.store.dispatch(LoginPageActions.login({ form }));
  }

}
