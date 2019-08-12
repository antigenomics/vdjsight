import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { fromRoot, RootModuleState } from 'models/root';
import { from } from 'rxjs';
import { exhaustMap, map, tap, withLatestFrom } from 'rxjs/operators';


@Injectable()
export class ApplicationEffects {

  public restoreLastSavedURL$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.restoreLastSavedURL),
    withLatestFrom(this.store.pipe(select(fromRoot.getApplicationLastSavedURL))),
    exhaustMap(([ action, lastSavedURL ]) => {
      const url = lastSavedURL ? lastSavedURL : action.fallbackURL;
      return from(this.router.navigateByUrl(url)).pipe(
        map(() => ApplicationActions.clearLastSavedURL())
      );
    })
  ));

  public reload$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.reload),
    tap(() => location.reload())
  ), { dispatch: false });

  constructor(private readonly actions$: Actions, private readonly store: Store<RootModuleState>,
              private readonly router: Router) {}

}
