import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApplicationActions } from 'models/application/application.actions';
import { UserActions } from 'models/user/user.actions';
import { LoginPageActions } from 'pages/auth/models/login_page/login-page.actions';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { AccountService } from 'services/account/account.service';
import { AuthorizationService } from 'services/authorization/authorization.service';
import { BackendErrorResponse } from 'services/backend/backend-response';

@Injectable()
export class LoginPageEffects {

  public loginAttempt$ = createEffect(() => this.actions$.pipe(
    ofType(LoginPageActions.loginAttempt),
    mergeMap((action) => this.authorization.login(action.form).pipe(
      map(() => LoginPageActions.loginSuccess()),
      catchError((error: BackendErrorResponse) => of(LoginPageActions.loginFailed(error))))
    ))
  );

  public loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LoginPageActions.loginSuccess),
    mergeMap(() => this.account.info().pipe(
      switchMap((response) => [
        UserActions.login({ info: response.user }),
        ApplicationActions.restoreLastSavedURL({ fallbackURL: '/' })
      ]),
      catchError(() => of(LoginPageActions.loginFailed({ error: 'Internal Server Error' })))
    ))
  ));

  constructor(private readonly actions$: Actions, private authorization: AuthorizationService,
              private readonly account: AccountService) {}

}
