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
  })
);

export namespace __fromNotificationsReducers {

  export function reducer(state: __NotificationsState | undefined, action: Action) {
    return notificationsReducer(state, action);
  }

}
