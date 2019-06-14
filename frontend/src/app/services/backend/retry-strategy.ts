import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export const enum ExcludedStatusCodes {
  BadRequest          = 400,
  NonAuthorized       = 401,
  Forbidden           = 403,
  NotFound            = 404,
  InternalServerError = 500,
  ServiceUnavailable  = 503
}

// tslint:disable-next-line:no-magic-numbers
export const retryStrategy = (maxRetry: number              = 3,
                              scalingDuration: number       = 250,
                              excludedStatusCodes: number[] = [
                                ExcludedStatusCodes.BadRequest,
                                ExcludedStatusCodes.NonAuthorized,
                                ExcludedStatusCodes.Forbidden,
                                ExcludedStatusCodes.NotFound,
                                ExcludedStatusCodes.InternalServerError,
                                ExcludedStatusCodes.ServiceUnavailable
                              ]) => (attempts: Observable<any>) => { // tslint:disable-line:no-any
  return attempts.pipe(mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetry || excludedStatusCodes.find((e) => e === error.status)) {
        return throwError(error);
      }
      return timer(retryAttempt * scalingDuration);
    })
  );
};
