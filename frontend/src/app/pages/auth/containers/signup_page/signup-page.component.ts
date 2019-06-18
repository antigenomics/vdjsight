import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { FormEnterAnimation } from 'pages/auth/animations/form-enter.animation';
import { AuthForms } from 'pages/auth/auth.forms';
import { AuthPagesModuleState, fromAuth } from 'pages/auth/models/auth-pages.state';
import { SignupPageActions } from 'pages/auth/models/signup_page/signup-page.action';

@Component({
  selector:        'vs-signup-page',
  templateUrl:     './signup-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FormEnterAnimation ]
})
export class SignupPageComponent implements OnInit {
  public readonly pending$ = this.store.pipe(select(fromAuth.isSignupPagePending));
  public readonly error$   = this.store.pipe(select(fromAuth.getSignupPageError));
  public readonly extra$   = this.store.pipe(select(fromAuth.getSignupPageExtra));

  constructor(private readonly store: Store<AuthPagesModuleState>, private readonly title: Title) {}

  public ngOnInit(): void {
    this.title.setTitle('VDJsight: Create account');
    this.store.dispatch(SignupPageActions.init());
  }

  public onSubmit(form: AuthForms.SignupForm): void {
    this.store.dispatch(SignupPageActions.signupAttempt({ form }));
  }
}
