import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { NetworkActions } from 'models/network/network.actions';
import { fromRoot, RootModuleState } from 'models/root';
import { from, Observable, of } from 'rxjs';
import { first, map, mergeMap, skipWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedOnlyGuard implements CanLoad, CanActivate {

  constructor(private readonly store: Store<RootModuleState>, private readonly router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.guard(route, state.url);
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.guard(route, segments.map((s) => s.path).join('/'));
  }

  private guard(route: Route | ActivatedRouteSnapshot, url: string): Observable<boolean> {
    this.store.dispatch(NetworkActions.GuardActivationStart({ title: 'Authorized only access', message: 'We need some time to check your credentials...' }));
    return this.store.pipe(select(fromRoot.isUserStateInitialized), skipWhile((initialized) => !initialized), first(), mergeMap(() => {
      return this.store.pipe(select(fromRoot.isUserLoggedIn), first(), mergeMap((isLoggedIn) => {
        this.store.dispatch(NetworkActions.GuardActivationEnd());
        if (!isLoggedIn) {
          this.store.dispatch(ApplicationActions.saveURL({ url }));
          return from(this.router.navigateByUrl(route.data.authorizedOnlyGuardFallbackURL)).pipe(map(() => false));
        }
        return of(true);
      }));
    }));
  }

}
