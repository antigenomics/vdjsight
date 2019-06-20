import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { fromRoot, RootModuleState } from 'models/root';
import { UserActions } from 'models/user/user.actions';
import { from, of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { AccountService } from 'services/account/account.service';
import { HttpStatusCode } from 'services/backend/http-codes';

@Injectable()
export class UserEffects implements OnInitEffects {

  public initialize$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.initialize),
    withLatestFrom(
      this.store.pipe(select(fromRoot.isUserStateInitialized)),
      this.store.pipe(select(fromRoot.isUserStateInitializeFailed))
    ),
    filter(([ _, isInitialized, isInitializeFailed ]) => isInitializeFailed || !isInitialized),
    map(() => UserActions.initializeStart())
  ));

  public initializeStart$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.initializeStart),
    mergeMap(() =>
      this.account.info().pipe(
        map((response) => UserActions.initializeSuccess({ loggedIn: true, user: response.user })),
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.UNAUTHORIZED) {
            return of(UserActions.initializeSuccess({ loggedIn: false }));
          } else {
            return of(UserActions.initializeFailed());
          }
        })
      )
    )
  ));

  public login$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.login),
    tap(() => window.localStorage.setItem('isLoggedIn', 'true')),
    tap(() => this.router.navigateByUrl(this.router.url))
  ), { dispatch: false });

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    tap(() => window.localStorage.setItem('isLoggedIn', 'false')),
    tap(() => this.router.navigateByUrl(this.router.url))
  ), { dispatch: false });

  public logoutWithRedirect$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logoutWithRedirect),
    mergeMap((action) => from(this.router.navigateByUrl(action.redirectTo)).pipe(
      map(() => UserActions.logout())
    ))
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<RootModuleState>,
              private readonly account: AccountService, private readonly router: Router) {}

  public ngrxOnInitEffects(): Action {
    return UserActions.initialize();
  }

}
