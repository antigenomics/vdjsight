import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { fromRoot, RootModuleState } from 'models/root';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { BackendService } from 'services/backend/backend.service';


@Injectable()
export class ApplicationEffects implements OnInitEffects {

  public pingBackend$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.pingBackend),
    mergeMap(() => this.backend.ping().pipe(
      map(() => ApplicationActions.pingBackendSuccess()),
      catchError(() => of(ApplicationActions.pingBackendFailed()))
    ))
  ));

  public restoreLastSavedURL$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.restoreLastSavedURL),
    withLatestFrom(this.store.pipe(select(fromRoot.getApplicationLastSavedURL))),
    mergeMap(([ action, lastSaved ]) => {
      const url         = lastSaved ? lastSaved.url : action.fallbackURL;
      const queryParams = lastSaved ? lastSaved.queryParams : action.fallbackQueryParams;
      return fromPromise(this.router.navigate([ url ], { queryParams })).pipe(
        map(() => ApplicationActions.clearLastSavedURL())
      );
    })
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<RootModuleState>,
              private readonly router: Router, private readonly backend: BackendService) {}

  public ngrxOnInitEffects(): Action {
    return ApplicationActions.pingBackend();
  }

}
