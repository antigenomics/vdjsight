import { createAction, props } from '@ngrx/store';
import { NotificationEntity } from 'models/notifications/notifications';

export namespace NotificationActions {

  export const create = createAction('[Notifications] Create', props<{ entity: NotificationEntity }>());
  export const remove = createAction('[Notifications] Remove', props<{ entity: NotificationEntity }>());

}
