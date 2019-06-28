import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { delay as rxjsDelay, flatMap } from 'rxjs/operators';
import { BackendErrorResponse } from 'services/backend/backend-response';

// tslint:disable:no-console
let backendDebugImpl: <T>() => (flow: Observable<T>) => Observable<T>;
if (environment.production) {
  backendDebugImpl = <T>() => (flow: Observable<T>) => flow;
} else {
  const backendServiceDebugProperties: any = { // tslint:disable-line:no-any
    enabled: localStorage.getItem('backend-debug:enable') === 'true' || false,
    failed:  false,
    delay:   Number(localStorage.getItem('backend-debug:delay')) || 750 // tslint:disable-line:no-magic-numbers
  };

  (window as any).backendServiceDebug = { // tslint:disable-line:no-any
    setDelay:   (delay: number) => {
      backendServiceDebugProperties.delay = delay;
      localStorage.setItem('backend-debug:delay', `${delay}`);
      console.log(`[Backend Debug]: Setting all requests to be delayed for ${delay} ms`);
    },
    failed:     () => {
      backendServiceDebugProperties.failed = true;
      console.log('[Backend Debug]: Setting all requests to be failed');
    },
    enable:     () => {
      backendServiceDebugProperties.enabled = true;
      localStorage.setItem('backend-debug:enable', 'true');
      console.log('[Backend Debug]: Enabling backend debug features');
    },
    disable:    () => {
      backendServiceDebugProperties.enabled = false;
      localStorage.setItem('backend-debug:enable', 'false');
      console.log('[Backend Debug]: Disabling backend debug features');
    },
    properties: () => {
      console.log(backendServiceDebugProperties);
    }
  };

  const debugFlowDelay = <T>() => (flow: Observable<T>) =>
    backendServiceDebugProperties.enabled ? flow.pipe(rxjsDelay(backendServiceDebugProperties.delay)) : flow;

  const debugFlowFailed = <T>() => (flow: Observable<T>) =>
    backendServiceDebugProperties.failed ? flow.pipe(flatMap(() =>
      throwError({ error: { error: 'Backend Debug Error' } as BackendErrorResponse }))) : flow;

  backendDebugImpl = <T>() => (flow: Observable<T>) => flow.pipe(debugFlowDelay(), debugFlowFailed());
}

export const backendDebug = backendDebugImpl;
// tslint:enable:no-console
