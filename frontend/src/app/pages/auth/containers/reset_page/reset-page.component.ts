import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { FormEnterAnimation } from 'pages/auth/animations/form-enter.animation';
import { AuthForms } from 'pages/auth/auth.forms';
import { AuthPagesModuleState, fromAuth } from 'pages/auth/models/auth-pages.state';
import { ResetPageActions } from 'pages/auth/models/reset_page/reset-page.actions';

@Component({
  selector:        'vs-reset-page',
  templateUrl:     './reset-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FormEnterAnimation ]
})
export class ResetPageComponent implements OnInit {
  public readonly pending$ = this.store.pipe(select(fromAuth.isResetPagePending));
  public readonly message$ = this.store.pipe(select(fromAuth.getResetPageMessage));
  public readonly error$   = this.store.pipe(select(fromAuth.getResetPageError));
  public readonly extra$   = this.store.pipe(select(fromAuth.getResetPageExtra));

  constructor(private readonly store: Store<AuthPagesModuleState>, private readonly title: Title) {}

  public ngOnInit(): void {
    this.title.setTitle('VDJsight: Reset account');
    this.store.dispatch(ResetPageActions.init());
  }

  public onSubmit(form: AuthForms.ResetForm): void {
    this.store.dispatch(ResetPageActions.reset({ form }));
  }
}
