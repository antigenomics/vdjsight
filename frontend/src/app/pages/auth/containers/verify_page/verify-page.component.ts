import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { FormEnterAnimation } from 'pages/auth/animations/form-enter.animation';
import { AuthPagesModuleState, fromAuth } from 'pages/auth/models/auth-pages.state';
import { VerifyPageActions } from 'pages/auth/models/verify_page/verify-page.actions';
import { Subscription } from 'rxjs';

@Component({
  selector:        'vs-verify-page',
  templateUrl:     './verify-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FormEnterAnimation ]
})
export class VerifyPageComponent implements OnInit, OnDestroy {
  private token: Subscription;

  public readonly pending$ = this.store.pipe(select(fromAuth.isVerifyPagePending));
  public readonly error$   = this.store.pipe(select(fromAuth.getVerifyPageError));
  public readonly extra$   = this.store.pipe(select(fromAuth.getVerifyPageExtra));

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<AuthPagesModuleState>,
              private readonly title: Title) {}

  public ngOnInit(): void {
    this.title.setTitle('VDJsight: Account verification');
    this.store.dispatch(VerifyPageActions.init());
    this.token = this.route.params.subscribe((parameters) => {
      this.store.dispatch(VerifyPageActions.verify({ token: parameters.token }));
    });
  }

  public ngOnDestroy(): void {
    this.token.unsubscribe();
  }

}
