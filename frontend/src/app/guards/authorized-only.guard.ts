import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Params, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { fromRoot, RootModuleState } from 'models/root';
import { Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { map, mergeMap, skipWhile, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedOnlyGuard implements CanLoad, CanActivate {

  constructor(private readonly store: Store<RootModuleState>, private readonly router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.guard(route, state.url, route.queryParams);
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.guard(route, segments.map((s) => s.path).join('/'), {});
  }

  private guard(route: Route | ActivatedRouteSnapshot, url: string, queryParams: Params): Observable<boolean> {
    return this.store.pipe(select(fromRoot.isUserStateInitialized), skipWhile((initialized) => !initialized), take(1), mergeMap(() => {
      return this.store.pipe(select(fromRoot.isUserLoggedIn), take(1), mergeMap((isLoggedIn) => {
        if (!isLoggedIn) {
          this.store.dispatch(ApplicationActions.saveURL({ url, queryParams }));
          return fromPromise(this.router.navigateByUrl(route.data.authorizedOnlyGuardFallbackURL)).pipe(map(() => false));
        }
        return of(true);
      }));
    }));
  }

}
