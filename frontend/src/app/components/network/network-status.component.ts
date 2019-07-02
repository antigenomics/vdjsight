import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BackgroundFade, NetworkGuardPopup, NetworkStatusPopup } from 'components/network/network-status.animations';
import { NetworkActions } from 'models/network/network.actions';
import { fromRoot, RootModuleState } from 'models/root';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector:        'vs-network-status',
  templateUrl:     './network-status.component.html',
  styleUrls:       [ './network-status.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ BackgroundFade, NetworkStatusPopup, NetworkGuardPopup ]
})
export class NetworkStatusComponent {
  private static readonly GuardInfoDebounceTime: number = 250;

  public readonly isOffline$ = this.store.pipe(select(fromRoot.isNetworkOffline));
  public readonly guardInfo$ = this.store.pipe(select(fromRoot.getNetworkGuardInfo)).pipe(
    debounceTime(NetworkStatusComponent.GuardInfoDebounceTime)
  );

  constructor(private readonly store: Store<RootModuleState>) {}

  public hideOfflineWarning(): void {
    this.store.dispatch(NetworkActions.GoOnline());
  }
}
