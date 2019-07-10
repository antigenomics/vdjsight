import { Injectable } from '@angular/core';

@Injectable()
export class SampleFilesEffects {

  // public load$ = createEffect(() => this.actions$.pipe(
  //   ofType(SampleFilesActions.load),
  //   withLatestFrom(
  //     // this.store.pipe(select(fromDashboardProject.getCurrentProjectLinkUUID))
  //   ),
  //   map(([ _, currentProjectLinkUUID ]) => SampleFilesActions.loadStart({ projectLinkUUID: currentProjectLinkUUID }))
  // ));

  // constructor(private readonly actions$: Actions, private readonly store: Store<DashboardProjectModuleState>,
  //             private readonly samples: SampleFilesService, private readonly notifications: NotificationsService) {}

}
