import { routerReducer } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { __RouterState } from 'models/router/router.state';

export namespace __fromRouterReducers {
  export function reducer(state: __RouterState | undefined, action: Action) {
    return routerReducer(state, action);
  }
}
