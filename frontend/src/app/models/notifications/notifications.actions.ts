import { createAction, props } from '@ngrx/store';
import { NotificationEntity } from 'models/notifications/notifications';

export namespace NotificationActions {

  export const create = createAction('[Notifications] Create', props<{ entity: NotificationEntity }>());
  export const remove = createAction('[Notifications] Remove', props<{ entity: NotificationEntity }>());

  export const scheduleRemove        = createAction('[Notifications] Schedule Remove', props<{ entity: NotificationEntity }>());
  export const startScheduledRemove  = createAction('[Notifications] Start Scheduled Remove', props<{ entity: NotificationEntity, scheduledId: number }>());
  export const cancelScheduledRemove = createAction('[Notifications] Cancel Scheduled Remove', props<{ entity: NotificationEntity }>());

}
