import { Observable, throwError, timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { HttpStatusCode } from 'services/backend/http-codes';

// tslint:disable-next-line:no-magic-numbers
export const retryStrategy = <T extends { status: number }>(maxRetry: number              = 3,
                                                            scalingDuration: number       = 250,
                                                            excludedStatusCodes: number[] = [
                                                              HttpStatusCode.BAD_REQUEST,
                                                              HttpStatusCode.UNAUTHORIZED,
                                                              HttpStatusCode.FORBIDDEN,
                                                              HttpStatusCode.NOT_FOUND,
                                                              HttpStatusCode.INTERNAL_SERVER_ERROR,
                                                              HttpStatusCode.SERVICE_UNAVAILABLE
                                                            ]) => (attempts: Observable<T>) => { // tslint:disable-line:no-any
  return attempts.pipe(concatMap((error, i) => {
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
