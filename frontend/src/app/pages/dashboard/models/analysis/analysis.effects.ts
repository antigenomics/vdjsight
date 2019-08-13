import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { UserActions } from 'models/user/user.actions';
import { CreateEmptyAnalysisEntity } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { AnalysisService } from 'pages/dashboard/services/analysis/analysis.service';
import { of } from 'rxjs';
import { catchError, filter, first, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class AnalysisEffects {

  public createIfNotExist$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.createIfNotExist),
    filter(({ sample }) => sample !== undefined),
    mergeMap(({ sample, analysisType }) =>
      this.store.pipe(
        select(fromDashboard.getAnalysisForProjectAndSampleWithType,
          { projectLinkUUID: sample.projectLinkUUID, sampleLinkUUID: sample.link.uuid, type: analysisType }),
        first(),
        filter((a) => a === undefined || a === null),
        map(() => {
          const analysis = CreateEmptyAnalysisEntity(sample.projectLinkUUID, sample.link.uuid, analysisType);
          return AnalysisActions.create({ sample, analysis });
        })
      )
    )
  ));

  public clonotypesSelectPage$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.clonotypesSelectPage),
    map(({ analysis, page, pageSize, pagesRegion }) => {

      if (analysis.data !== undefined && analysis.data.view !== undefined) {
        const localPage = analysis.data.view.pages.find((p) => p.page === page);
        if (localPage !== undefined) {
          return AnalysisActions.clonotypesLocalPageFound({ analysis, page: localPage });
        }
      }

      return AnalysisActions.clonotypesUpdate({ analysis, page, pageSize, pagesRegion });
    })
  ));

  public clonotypesUpdate$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.clonotypesUpdate),
    mergeMap(({ analysis, page, pageSize, pagesRegion }) =>
      this.analysis.clonotypes(analysis.projectLinkUUID, analysis.sampleLinkUUID, { page, pageSize, pagesRegion }).pipe(
        map(({ view }) => AnalysisActions.clonotypesUpdateSuccess({ analysisId: analysis.id, view })),
        catchError((error) => of(AnalysisActions.clonotypesUpdateFailed({ analysisId: analysis.id, error })))
      ))
  ));

  public clear$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    map(() => AnalysisActions.clear())
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardModuleState>,
              private readonly analysis: AnalysisService) {}

}
