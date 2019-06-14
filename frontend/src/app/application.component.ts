import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromRoot, RootState } from 'models/root';

@Component({
  selector:        'vs-application-root',
  templateUrl:     './application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationComponent {
  public readonly isInitialized$ = this.store.pipe(select(fromRoot.isApplicationInitialized));

  constructor(private readonly store: Store<RootState>) {}
}
