import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { UserActions } from 'models/user/user.actions';
import { AnalysisClonotypesEntity } from 'pages/dashboard/models/analysis/analysis';
import { AnalysisActions } from 'pages/dashboard/models/analysis/analysis.actions';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { CreateClonotypeTableAnalysisMarker } from 'pages/dashboard/services/analysis/analysis-clonotypes';
import { AnalysisService } from 'pages/dashboard/services/analysis/analysis.service';
import { of } from 'rxjs';
import { catchError, filter, first, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class AnalysisEffects {

  public createIfNotExist$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.createIfNotExist),
    filter(({ sample }) => sample !== undefined),
    mergeMap(({ sample, analysis }) =>
      this.store.pipe(
        select(fromDashboard.getAnalysisForProjectAndSampleWithType,
          { projectLinkUUID: sample.projectLinkUUID, sampleLinkUUID: sample.link.uuid, type: analysis.analysisType }),
        first(),
        filter((a) => a === undefined || a === null),
        map(() => {
          return AnalysisActions.create({ sample, analysis });
        })
      )
    )
  ));

  public clonotypesSelectPage$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.clonotypesSelectPage),
    mergeMap(({ analysisId, page, pageSize, pagesRegion, forceUpdate }) => {
      return this.store.pipe(select(fromDashboard.getAnalysisByID, { id: analysisId }), first(), map((analysis: AnalysisClonotypesEntity) => {
        const isForcedUpdate  = forceUpdate !== undefined && forceUpdate;
        const isViewExist     = analysis.data !== undefined && analysis.data !== null && analysis.data.view !== undefined && analysis.data.view !== null;
        const isMarkerMatched = isViewExist && analysis.data.marker === CreateClonotypeTableAnalysisMarker(analysis.options);

        if (!isForcedUpdate && isViewExist && isMarkerMatched) {
          const localPage = analysis.data.view.pages.find((p) => p.page === page);
          if (localPage !== undefined) {
            return AnalysisActions.clonotypesLocalPageFound({ analysisId: analysisId, page: localPage });
          }
        }

        return AnalysisActions.clonotypesUpdate({ analysisId: analysisId, page, pageSize, pagesRegion });
      }));
    })
  ));

  public clonotypesUpdate$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.clonotypesUpdate),
    mergeMap(({ analysisId, page, pageSize, pagesRegion }) => {
      return this.store.pipe(select(fromDashboard.getAnalysisByID, { id: analysisId }), first(), mergeMap((analysis: AnalysisClonotypesEntity) => {
        const marker = CreateClonotypeTableAnalysisMarker(analysis.options);
        return this.analysis.clonotypes(analysis.projectLinkUUID, analysis.sampleLinkUUID, {
          page:        page,
          pageSize:    pageSize,
          pagesRegion: pagesRegion,
          marker:      marker,
          options:     analysis.options
        }).pipe(
          map(({ view }) => AnalysisActions.clonotypesUpdateSuccess({ analysisId: analysis.id, view, marker })),
          catchError((error) => of(AnalysisActions.clonotypesUpdateFailed({ analysisId: analysis.id, error })))
        );
      }));
    })
  ));

  public clonotypesChangeOptions$ = createEffect(() => this.actions$.pipe(
    ofType(AnalysisActions.clonotypesChangeOptions),
    filter(({ forceUpdate }) => forceUpdate !== undefined && forceUpdate),
    map(({ analysisId }) => AnalysisActions.clonotypesSelectPage({ analysisId: analysisId, page: 0, pageSize: 10, pagesRegion: 5 }))
  ));

  public clear$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.logout),
    map(() => AnalysisActions.clear())
  ));

  constructor(private readonly actions$: Actions, private readonly store: Store<DashboardModuleState>,
              private readonly analysis: AnalysisService) {}

}
