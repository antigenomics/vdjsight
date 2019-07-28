import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ResetPageActions } from 'pages/auth/models/reset_page/reset-page.actions';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { AuthorizationService } from 'services/authorization/authorization.service';
import { BackendErrorResponse } from 'services/backend/backend-response';


@Injectable()
export class ResetPageEffects {

  public reset$ = createEffect(() => this.actions$.pipe(
    ofType(ResetPageActions.reset),
    exhaustMap((action) => this.authorization.reset(action.form).pipe(
      map((message) => ResetPageActions.resetSuccess(message)),
      catchError((error: BackendErrorResponse) => of(ResetPageActions.resetFailed(error))))
    ))
  );

  constructor(private readonly actions$: Actions, private authorization: AuthorizationService) {}

}
