import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { fromRoot, RootState } from 'models/root';
import { UserActions } from 'models/user/user.action';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { AccountService } from 'services/account/account.service';
import { HttpStatusCode } from 'services/backend/http-codes';
import { LoggerService } from 'utils/logger/logger.service';

@Injectable()
export class UserEffects implements OnInitEffects {

  public fetch$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.fetch),
    withLatestFrom(
      this.store.pipe(select(fromRoot.isUserStateFetched)),
      this.store.pipe(select(fromRoot.isUserStateFetchFailed))
    ),
    filter(([ _, isFetched, isFetchFailed ]) => isFetchFailed || !isFetched),
    map(() => UserActions.fetchStart())
  ));

  public fetchStart$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.fetchStart),
    mergeMap(() =>
      this.account.info().pipe(
        map((info) => UserActions.fetchSuccess({ loggedIn: true, info: info })),
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.UNAUTHORIZED) {
            return of(UserActions.fetchSuccess({ loggedIn: false }));
          } else {
            return of(UserActions.fetchFailed());
          }
        })
      )
    )
  ));

  public login$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.login),
    tap(() => window.localStorage.setItem('isLoggedIn', 'true'))
  ), { dispatch: false });

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    tap(() => window.localStorage.setItem('isLoggedIn', 'false'))
  ), { dispatch: false });

  constructor(private readonly actions$: Actions, private readonly store: Store<RootState>,
              private readonly account: AccountService, private readonly logger: LoggerService) {}

  public ngrxOnInitEffects(): Action {
    this.logger.info('[User] Fetching user info');
    return UserActions.fetch();
  }

}
