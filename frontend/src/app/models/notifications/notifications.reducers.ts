import { Action, createReducer, on } from '@ngrx/store';
import { NotificationActions } from 'models/notifications/notifications.actions';
import { __fromNotificationsState, __NotificationsState, NotificationsStateAdapter } from 'models/notifications/notifications.state';

const notificationsReducer = createReducer(
  __fromNotificationsState.initial,
  on(NotificationActions.create, (state, { entity }) => {
    return NotificationsStateAdapter.addOne(entity, state);
  }),
  on(NotificationActions.remove, (state, { entity }) => {
    return NotificationsStateAdapter.removeOne(entity.id, state);
  }),
  on(NotificationActions.scheduleRemove, (state, { entity }) => {
    return NotificationsStateAdapter.updateOne({ id: entity.id, changes: { scheduled: true } }, state);
  }),
  on(NotificationActions.startScheduledRemove, (state, { entity, scheduledId }) => {
    return NotificationsStateAdapter.updateOne({ id: entity.id, changes: { scheduledId } }, state);
  }),
  on(NotificationActions.cancelScheduledRemove, (state, { entity }) => {
    return NotificationsStateAdapter.updateOne({ id: entity.id, changes: { scheduled: false } }, state);
  })
);

export namespace __fromNotificationsReducers {

  export function reducer(state: __NotificationsState | undefined, action: Action) {
    return notificationsReducer(state, action);
  }

}
