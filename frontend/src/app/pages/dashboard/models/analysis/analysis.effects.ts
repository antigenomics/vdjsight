import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { UserActions } from 'models/user/user.actions';
import { CreateEmptyAnalysisEntity } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { AnalysisService } from 'pages/dashboard/services/analysis/analysis.service';
import { of } from 'rxjs';
import { catchError, filter, first, map, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class AnalysisEffects {

  public createIfNotExist$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.createIfNotExist),
    mergeMap(({ sample, analysisType }) =>
      this.store.pipe(
        select(fromDashboard.getAnalysisForProjectAndSampleWithType,
          { projectLinkUUID: sample.projectLinkUUID, sampleLinkUUID: sample.link.uuid, type: analysisType }),
        first(),
        tap((a) => console.log(a)),
        filter((a) => a === undefined || a === null),
        map(() => {
          const analysis = CreateEmptyAnalysisEntity(sample.projectLinkUUID, sample.link.uuid, analysisType);
          return AnalysisActions.create({ sample, analysis });
        })
      )
    )
  ));

  public clonotypes$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.clonotypes),
    mergeMap(({ analysis, page, pageSize, pagesRegion }) =>
      this.analysis.clonotypes(analysis.projectLinkUUID, analysis.sampleLinkUUID, { page, pageSize, pagesRegion }).pipe(
        map(({ view }) => AnalysisActions.clonotypesSuccess({ analysisId: 0, view })),
        catchError((error) => of(AnalysisActions.clonotypesFailed({ analysisId: 0, error })))
      ))
  ));

  public clear$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    map(() => AnalysisActions.clear())
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardModuleState>,
              private readonly analysis: AnalysisService) {}

}
