import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BackgroundFade, NetworkStatusPopup } from 'components/network/network-status.animations';
import { NetworkActions } from 'models/network/network.actions';
import { fromRoot, RootModuleState } from 'models/root';

@Component({
  selector:        'vs-network-status',
  templateUrl:     './network-status.component.html',
  styleUrls:       [ './network-status.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ BackgroundFade, NetworkStatusPopup ]
})
export class NetworkStatusComponent {
  public readonly isOffline$ = this.store.pipe(select(fromRoot.isNetworkOffline));

  constructor(private readonly store: Store<RootModuleState>) {}

  public hideOfflineWarning(): void {
    this.store.dispatch(NetworkActions.GoOnline());
  }
}
