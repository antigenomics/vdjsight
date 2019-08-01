import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { SamplesActions } from 'pages/dashboard/models/samples/samples.actions';
import { CurrentProjectActions } from 'pages/dashboard/pages/project/models/project/project.actions';
import { DashboardSampleModuleState, fromDashboardSample } from 'pages/dashboard/pages/project/pages/sample/models/dashboard-sample.state';
import { CurrentSampleActions } from 'pages/dashboard/pages/project/pages/sample/models/sample/sample.actions';
import { filter, map, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class SampleEffects {

  public sampleDeleted$ = createEffect(() => this.actions$.pipe(
    ofType(SamplesActions.forceDeleteSuccess),
    withLatestFrom(this.store.pipe(select(fromDashboardSample.getCurrentSampleUUID))),
    filter(([ action, currentSampleUUID ]) => action.entity.link.uuid === currentSampleUUID),
    map(() => CurrentSampleActions.deselect({ withRedirect: true }))
  ));

  public deselect$ = createEffect(() => this.actions$.pipe(
    ofType(CurrentSampleActions.deselect),
    map(() => CurrentProjectActions.toProjectURL())
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardSampleModuleState>) {}

}
