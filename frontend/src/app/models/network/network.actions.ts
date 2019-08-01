import { createAction, props } from '@ngrx/store';

export namespace NetworkActions {

  export const GoOffline = createAction('[Network] Go Offline');
  export const GoOnline  = createAction('[Network] Go Online', props<{ pingBackend: boolean }>());

  export const pingBackend                = createAction('[Network] Ping Backend');
  export const pingBackendSuccess         = createAction('[Network] Ping Backend Success');
  export const pingBackendFailed          = createAction('[Network] Ping Backend Failed');
  export const pingBackendScheduleStart   = createAction('[Network] Ping Backend Schedule Start', props<{ timeout: number }>());
  export const pingBackendScheduleStarted = createAction('[Network] Ping Backend Schedule Started', props<{ pingTimeoutId: number }>());
  export const pingBackendScheduleStop    = createAction('[Network] Ping Backend Schedule Stop');
  export const pingBackendScheduleStopped = createAction('[Network] Ping Backend Schedule Stopped');

  export const GuardActivationStart = createAction('[Network] Guard Activation Start', props<{ title: string, message: string }>());
  export const GuardActivationEnd   = createAction('[Network] Guard Activation End');

}
