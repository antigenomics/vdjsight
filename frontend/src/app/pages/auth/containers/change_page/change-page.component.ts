import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { FormEnterAnimation } from 'pages/auth/animations/form-enter.animation';
import { AuthForms } from 'pages/auth/auth.forms';
import { AuthPagesModuleState, fromAuth } from 'pages/auth/models/auth-pages.state';
import { ChangePageActions } from 'pages/auth/models/change_page/change-page.actions';
import { map } from 'rxjs/operators';

@Component({
  selector:        'vs-change-page',
  templateUrl:     './change-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FormEnterAnimation ]
})
export class ChangePageComponent implements OnInit {

  public readonly pending$ = this.store.pipe(select(fromAuth.isChangePagePending));
  public readonly error$   = this.store.pipe(select(fromAuth.getChangePageError));
  public readonly extra$   = this.store.pipe(select(fromAuth.getChangePageExtra));
  public readonly token$   = this.route.params.pipe(map((parameters) => parameters.token));

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<AuthPagesModuleState>,
              private readonly title: Title) {}

  public ngOnInit(): void {
    this.title.setTitle('VDJsight: Change password');
    this.store.dispatch(ChangePageActions.init());
  }

  public onSubmit(event: { token: string, form: AuthForms.ChangeForm }): void {
    this.store.dispatch(ChangePageActions.change({ token: event.token, form: event.form }));
  }

}
