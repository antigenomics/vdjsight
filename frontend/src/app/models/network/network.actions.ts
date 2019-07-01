import { createAction } from '@ngrx/store';

export namespace NetworkActions {

  export const GoOffline = createAction('[Network] Go Offline');
  export const GoOnline  = createAction('[Network] Go Online');

}
