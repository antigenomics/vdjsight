import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from 'models/user/user.action';
import { LoginPageActions } from 'pages/auth/models/login_page/login-page.actions';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AccountService } from 'services/account/account.service';
import { AuthorizationService } from 'services/authorization/authorization.service';

@Injectable()
export class LoginPageEffects {

  public loginAttempt$ = createEffect(() => this.actions$.pipe(
    ofType(LoginPageActions.loginAttempt),
    mergeMap((action) => this.authorization.login(action.form.email, action.form.password).pipe(
      map(() => LoginPageActions.loginSuccess()),
      catchError(() => of(LoginPageActions.loginFailed({ error: 'error' }))))
    ))
  );

  public loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(LoginPageActions.loginSuccess),
    mergeMap(() => this.account.info().pipe(
      mergeMap((info) => fromPromise(this.router.navigateByUrl('/')).pipe(
        map(() => UserActions.login({ info }))
      )),
      catchError(() => of(LoginPageActions.loginFailed({ error: 'Internal Server Error' })))
    ))
  ));

  constructor(private readonly actions$: Actions, private authorization: AuthorizationService,
              private readonly account: AccountService, private router: Router) {}

}
