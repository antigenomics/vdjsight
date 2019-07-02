import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NetworkActions } from 'models/network/network.actions';
import { fromRoot, RootModuleState } from 'models/root';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap, skipWhile, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NonAuthorizedOnlyGuard implements CanLoad, CanActivate {

  constructor(private store: Store<RootModuleState>, private router: Router) {}

  public canLoad(route: Route): Observable<boolean> {
    return this.guard(route);
  }

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.guard(route);
  }

  private guard(route: Route | ActivatedRouteSnapshot): Observable<boolean> {
    this.store.dispatch(NetworkActions.GuardActivationStart({ title: 'Unauthorized only access', message: 'We need some time to check your credentials...' }));
    return this.store.pipe(select(fromRoot.isUserStateInitialized), skipWhile((initialized) => !initialized), take(1), mergeMap(() => {
      return this.store.pipe(select(fromRoot.isUserLoggedIn), take(1), mergeMap((isLoggedIn) => {
        this.store.dispatch(NetworkActions.GuardActivationEnd());
        if (isLoggedIn) {
          return from(this.router.navigateByUrl(route.data.nonAuthorizedOnlyGuardFallbackURL)).pipe(map(() => false));
        }
        return of(true);
      }));
    }));
  }

}
