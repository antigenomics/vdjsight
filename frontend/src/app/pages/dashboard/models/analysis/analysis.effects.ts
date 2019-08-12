import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from 'models/user/user.actions';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class AnalysisEffects {

  public clear$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    map(() => AnalysisActions.clear())
  ));

  constructor(private readonly actions$: Actions) {}

}
