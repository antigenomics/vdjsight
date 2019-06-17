import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromRoot, RootModuleState } from 'models/root';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
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
    return this.store.pipe(select(fromRoot.isUserStateInitialized), skipWhile((initialized) => !initialized), take(1), mergeMap(() => {
      return this.store.pipe(select(fromRoot.isUserLoggedIn), take(1), mergeMap((isLoggedIn) => {
        if (isLoggedIn) {
          return fromPromise(this.router.navigateByUrl(route.data.nonAuthorizedOnlyGuardFallbackURL)).pipe(map(() => false));
        }
        return of(true);
      }));
    }));
  }

}
