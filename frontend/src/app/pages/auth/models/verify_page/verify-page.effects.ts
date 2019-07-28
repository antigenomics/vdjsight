import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginPageActions } from 'pages/auth/models/login_page/login-page.actions';
import { VerifyPageActions } from 'pages/auth/models/verify_page/verify-page.actions';
import { from, of } from 'rxjs';
import { catchError, map, exhaustMap, switchMap } from 'rxjs/operators';
import { AuthorizationService } from 'services/authorization/authorization.service';
import { BackendErrorResponse } from 'services/backend/backend-response';

@Injectable()
export class VerifyPageEffects {

  public verifyAttempt$ = createEffect(() => this.actions$.pipe(
    ofType(VerifyPageActions.verify),
    exhaustMap((action) => this.authorization.verify({ token: action.token }).pipe(
      map((response) => VerifyPageActions.verifySuccess(response)),
      catchError((error: BackendErrorResponse) => of(VerifyPageActions.verifyFailed(error)))
    ))
  ));

  public verifySuccess$ = createEffect(() => this.actions$.pipe(
    ofType(VerifyPageActions.verifySuccess),
    switchMap((message) => from(this.router.navigateByUrl('/auth/login')).pipe(
      map(() => LoginPageActions.message(message))
    ))
  ));

  constructor(private readonly actions$: Actions, private authorization: AuthorizationService,
              private readonly router: Router) {}

}
