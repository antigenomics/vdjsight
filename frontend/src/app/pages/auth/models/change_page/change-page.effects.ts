import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChangePageActions } from 'pages/auth/models/change_page/change-page.actions';
import { LoginPageActions } from 'pages/auth/models/login_page/login-page.actions';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthorizationService } from 'services/authorization/authorization.service';
import { BackendErrorResponse } from 'services/backend/backend-response';

@Injectable()
export class ChangePageEffects {

  public change$ = createEffect(() => this.actions$.pipe(
    ofType(ChangePageActions.change),
    switchMap((action) =>
      this.authorization.change({ token: action.token, password1: action.form.password1, password2: action.form.password2 }).pipe(
        map((response) => ChangePageActions.changeSuccess(response)),
        catchError((error: BackendErrorResponse) => of(ChangePageActions.changeFailed(error)))
      ))
  ));

  public changeSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ChangePageActions.changeSuccess),
    switchMap((message) => from(this.router.navigateByUrl('/auth/login')).pipe(
      map(() => LoginPageActions.message(message))
    ))
  ));

  constructor(private readonly actions$: Actions, private authorization: AuthorizationService,
              private readonly router: Router) {}

}
