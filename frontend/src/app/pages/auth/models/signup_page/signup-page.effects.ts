import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginPageActions } from 'pages/auth/models/login_page/login-page.actions';
import { SignupPageActions } from 'pages/auth/models/signup_page/signup-page.actions';
import { from, of } from 'rxjs';
import { catchError, map, exhaustMap, switchMap } from 'rxjs/operators';
import { AuthorizationService } from 'services/authorization/authorization.service';
import { BackendErrorResponse } from 'services/backend/backend-response';

@Injectable()
export class SignupPageEffects {

  public signup$ = createEffect(() => this.actions$.pipe(
    ofType(SignupPageActions.signup),
    exhaustMap((action) => this.authorization.signup(action.form).pipe(
      map((response) => SignupPageActions.signupSuccess(response)),
      catchError((error: BackendErrorResponse) => of(SignupPageActions.signupFailed(error))))
    ))
  );

  public signupSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(SignupPageActions.signupSuccess),
    switchMap((message) => from(this.router.navigateByUrl('/auth/login')).pipe(
      map(() => LoginPageActions.message(message))
    ))
  ));

  constructor(private readonly actions$: Actions, private authorization: AuthorizationService,
              private readonly router: Router) {}

}
