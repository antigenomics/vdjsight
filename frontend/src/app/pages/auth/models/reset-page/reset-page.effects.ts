import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ResetPageActions } from 'pages/auth/models/reset-page/reset-page.actions';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthorizationService } from 'services/authorization/authorization.service';
import { BackendErrorResponse } from 'services/backend/backend-response';


@Injectable()
export class ResetPageEffects {

  public resetAttempt$ = createEffect(() => this.actions$.pipe(
    ofType(ResetPageActions.resetAttempt),
    mergeMap((action) => this.authorization.reset(action.form).pipe(
      map((message) => ResetPageActions.resetSuccess(message)),
      catchError((error: BackendErrorResponse) => of(ResetPageActions.resetFailed(error))))
    ))
  );

  constructor(private readonly actions$: Actions, private authorization: AuthorizationService) {}

}
