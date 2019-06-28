import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { NotificationEntity } from 'models/notifications/notifications';

interface __NotificationsStateInner { // tslint:disable-line:class-name
  enabled: boolean;
}

export type __NotificationsState = EntityState<NotificationEntity> & __NotificationsStateInner;

export const NotificationsStateAdapter = createEntityAdapter<NotificationEntity>({
  selectId:     (notification) => notification.id,
  sortComparer: false
});

export namespace __fromNotificationsState {

  export const initial = NotificationsStateAdapter.getInitialState<__NotificationsStateInner>({
    enabled: true
  });

  export const isEnabled  = (state: __NotificationsState) => state.enabled;
  export const isDisabled = (state: __NotificationsState) => !state.enabled;
  export const selectByID = (state: __NotificationsState, props: { id: number }) => state.entities[ props.id ];

  export const { selectIds, selectEntities, selectAll, selectTotal } = NotificationsStateAdapter.getSelectors();

}
