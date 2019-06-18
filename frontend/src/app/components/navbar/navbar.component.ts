import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromRoot, RootModuleState } from 'models/root';
import { UserActions } from 'models/user/user.actions';
import { AuthorizationService } from 'services/authorization/authorization.service';

@Component({
  selector:        'vs-navigation-bar',
  templateUrl:     './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent {
  public readonly isUserStateInitialized$ = this.store.pipe(select(fromRoot.isUserStateInitialized));
  public readonly isUserLoggedIn$         = this.store.pipe(select(fromRoot.isUserLoggedIn));
  public readonly userInfo$               = this.store.pipe(select(fromRoot.getUserInfo));

  constructor(private store: Store<RootModuleState>, private authorization: AuthorizationService) {}

  public logout(): void {
    this.authorization.logout().subscribe(() => this.store.dispatch(UserActions.logout()));
  }

}
