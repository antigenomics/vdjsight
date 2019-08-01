import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { NetworkActions } from 'models/network/network.actions';
import { fromRoot, RootModuleState } from 'models/root';
import { fromEvent, of } from 'rxjs';
import { catchError, exhaustMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { BackendService } from 'services/backend/backend.service';

@Injectable()
export class NetworkEffects implements OnInitEffects {

  public online$ = createEffect(() => fromEvent(window, 'online').pipe(
    map(() => NetworkActions.GoOnline({ pingBackend: true }))
  ));

  public goOnline$ = createEffect(() => this.actions$.pipe(
    ofType(NetworkActions.GoOnline),
    filter(({ pingBackend }) => pingBackend),
    map(() => NetworkActions.pingBackend())
  ));

  public offline$ = createEffect(() => fromEvent(window, 'offline').pipe(
    map(() => NetworkActions.GoOffline())
  ));

  public goOffline$ = createEffect(() => this.actions$.pipe(
    ofType(NetworkActions.GoOffline),
    map(() => NetworkActions.pingBackendFailed())
  ));

  public pingBackend$ = createEffect(() => this.actions$.pipe(
    ofType(NetworkActions.pingBackend),
    exhaustMap(() => this.backend.ping().pipe(
      map(() => NetworkActions.pingBackendSuccess()),
      catchError(() => of(NetworkActions.pingBackendFailed()))
    ))
  ));

  public pingBackendSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(NetworkActions.pingBackendSuccess),
    map(() => NetworkActions.pingBackendScheduleStop())
  ));

  public pingBackendScheduleStart$ = createEffect(() => this.actions$.pipe(
    ofType(NetworkActions.pingBackendScheduleStart),
    withLatestFrom(this.store.pipe(select(fromRoot.getNetworkBackendPingTimeoutId))),
    filter(([ _, timeoutId ]) => timeoutId === undefined),
    exhaustMap(([ action, _ ]) => {
      const timeoutId = window.setInterval(() => {
        this.store.dispatch(NetworkActions.pingBackend());
      }, action.timeout);
      return of(NetworkActions.pingBackendScheduleStarted({ pingTimeoutId: timeoutId }));
    })
  ));

  public pingBackendScheduleStarted$ = createEffect(() => this.actions$.pipe(
    ofType(NetworkActions.pingBackendScheduleStarted),
    map(() => NetworkActions.pingBackend())
  ));

  public pingBackendScheduleStop$ = createEffect(() => this.actions$.pipe(
    ofType(NetworkActions.pingBackendScheduleStop),
    withLatestFrom(this.store.pipe(select(fromRoot.getNetworkBackendPingTimeoutId))),
    exhaustMap(([ _, timeoutId ]) => {
      if (timeoutId !== undefined) {
        window.clearInterval(timeoutId);
      }
      return of(NetworkActions.pingBackendScheduleStopped());
    })
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<RootModuleState>,
              private readonly backend: BackendService) {}

  public ngrxOnInitEffects(): Action {
    return NetworkActions.pingBackend();
  }

}
