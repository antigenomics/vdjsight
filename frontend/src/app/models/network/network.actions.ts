import { createAction, props } from '@ngrx/store';

export namespace NetworkActions {

  export const GoOffline = createAction('[Network] Go Offline');
  export const GoOnline  = createAction('[Network] Go Online');

  export const GuardActivationStart = createAction('[Network] Guard Activation Start', props<{ title: string, message: string }>());
  export const GuardActivationEnd   = createAction('[Network] Guard Activation End');

}
