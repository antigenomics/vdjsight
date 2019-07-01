import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { NetworkActions } from 'models/network/network.actions';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NetworkEffects {

  public online$ = createEffect(() => fromEvent(window, 'online').pipe(
    map(() => NetworkActions.GoOnline())
  ));

  public offline$ = createEffect(() => fromEvent(window, 'offline').pipe(
    map(() => NetworkActions.GoOffline())
  ));

}
