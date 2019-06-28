import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NotificationActions } from 'models/notifications/notifications.actions';
import { RootModuleState } from 'models/root';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class NotificationsEffects {
  public static readonly NotificationScheduleRemoveDelay: number = 400;

  public create$ = createEffect(() => this.actions.pipe(
    ofType(NotificationActions.create),
    tap(({ entity }) => {
      if (entity.options.autoRemove) {
        setTimeout(() => {
          this.store.dispatch(NotificationActions.scheduleRemove({ entity }));
        }, NotificationsEffects.NotificationScheduleRemoveDelay);
      }
    })
  ), { dispatch: false });

  public scheduleRemove$ = createEffect(() => this.actions.pipe(
    ofType(NotificationActions.scheduleRemove),
    map(({ entity }) => {
      clearTimeout(entity.scheduledId);
      const scheduledId = setTimeout(() => {
        this.store.dispatch(NotificationActions.remove({ entity }));
      }, entity.options.timeout);
      return NotificationActions.startScheduledRemove({ entity, scheduledId });
    })
  ));

  public cancelScheduledRemove$ = createEffect(() => this.actions.pipe(
    ofType(NotificationActions.cancelScheduledRemove),
    tap(({ entity }) => {
      clearTimeout(entity.scheduledId);
    })
  ), { dispatch: false });

  constructor(private readonly actions: Actions, private store: Store<RootModuleState>) {}

}
