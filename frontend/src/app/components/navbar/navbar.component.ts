import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromRoot, RootState } from 'models/root';
import { AuthorizationService } from 'services/authorization/authorization.service';
import { UserActions } from 'models/user/user.action';

@Component({
  selector:        'vs-navigation-bar',
  templateUrl:     './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent {
  public readonly isUserStateFetched$ = this.store.pipe(select(fromRoot.isUserStateFetched));
  public readonly isUserLoggedIn$     = this.store.pipe(select(fromRoot.isUserLoggedIn));
  public readonly userInfo$           = this.store.pipe(select(fromRoot.getUserInfo));

  constructor(private store: Store<RootState>, private authorization: AuthorizationService) {}

  public test_login(): void {
    this.authorization.login().subscribe(() => this.store.dispatch(UserActions.login({ info: { email: 'bvd@a', login: '??' } })));
    console.log('asd');
  }

  public logout(): void {
    this.authorization.logout().subscribe(() => this.store.dispatch(UserActions.logout()));
  }

}
