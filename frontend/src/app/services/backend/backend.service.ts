import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { NetworkActions } from 'models/network/network.actions';
import { fromRoot, RootModuleState } from 'models/root';
import { UserActions } from 'models/user/user.actions';
import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, first, flatMap, map, mergeMap, retryWhen, tap } from 'rxjs/operators';
import { backendDebug } from 'services/backend/backend-debug';
import { LoggerService } from 'utils/logger/logger.service';
import { BackendRequest, BackendRequestEndpoint, BackendRequestOptions, BackendRequestType } from './backend-request';
import { BackendErrorResponse, BackendSuccessResponse } from './backend-response';
import { HttpStatusCode } from './http-codes';
import { RateLimiter } from './rate-limiter';
import { retryStrategy } from './retry-strategy';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private static readonly deadBackendPingTimeout = 15000; // 15 seconds
  private static readonly rateTimeout: number    = environment.backend.limits.timeout;
  private static readonly rateCount: number      = environment.backend.limits.count;
  private static readonly retryCount: number     = environment.backend.limits.retry;

  public static readonly api = BackendService.getAPIUrl();

  private readonly limiter: RateLimiter<BackendRequest<any>> = new RateLimiter(BackendService.rateTimeout, BackendService.rateCount); // tslint:disable-line:no-any

  constructor(private readonly http: HttpClient, private readonly store: Store<RootModuleState>,
              private readonly logger: LoggerService) {}

  public get<T, B = T>(endpoint: BackendRequestEndpoint, options?: BackendRequestOptions): Observable<B> {
    return this.next<T, B>({ endpoint: endpoint, type: BackendRequestType.GET }, options);
  }

  public post<T, B = T>(endpoint: BackendRequestEndpoint, data: T, options?: BackendRequestOptions): Observable<B> {
    return this.next<T, B>({ endpoint: endpoint, type: BackendRequestType.POST, data: data }, options);
  }

  public put<T, B = T>(endpoint: BackendRequestEndpoint, data: T, options?: BackendRequestOptions): Observable<B> {
    return this.next<T, B>({ endpoint: endpoint, type: BackendRequestType.PUT, data: data }, options);
  }

  public delete<T, B = T>(endpoint: BackendRequestEndpoint, options?: BackendRequestOptions): Observable<B> {
    return this.next<T, B>({ endpoint: endpoint, type: BackendRequestType.DELETE }, options);
  }

  public ping(): Observable<void> {
    return this.get<void>('ping');
  }

  public retryOnFail<T>(): (source: Observable<T>) => Observable<T> {
    return (source) => source.pipe(retryWhen(retryStrategy(BackendService.retryCount)));
  }

  public catchErrors<T>(): (source: Observable<T>) => Observable<T> {
    return (source) => source.pipe(catchError((error: HttpErrorResponse) => {
      if (!navigator.onLine) {
        this.store.dispatch(NetworkActions.GoOffline());
      }
      if (error.status === 0) {
        return combineLatest([
          this.store.pipe(select(fromRoot.isNetworkBackendDead)),
          this.store.pipe(select(fromRoot.isNetworkBackendPingScheduled))
        ]).pipe(first(), mergeMap(([ isBackendDead, isBackendPingScheduled ]) => {
          if (isBackendDead && !isBackendPingScheduled) {
            this.store.dispatch(NetworkActions.pingBackendScheduleStart({ timeout: BackendService.deadBackendPingTimeout }));
          }
          if (isBackendDead) {
            return throwError({ error: 'Server is unavailable now. Please try again later.' } as BackendErrorResponse);
          } else {
            return throwError({ error: 'Unknown error. Please try again later.' } as BackendErrorResponse);
          }
        }));
      } else if (error.status === HttpStatusCode.UNAUTHORIZED) {
        this.store.dispatch(UserActions.logout());
      }
      return throwError(error.error as BackendErrorResponse);
    }));
  }

  private next<T, B = T>(request: BackendRequest<T>, options?: BackendRequestOptions): Observable<B> {
    const url = BackendService.endpointToURL(request.endpoint);
    return this.limiter.request(request).pipe(backendDebug(), flatMap((r: BackendRequest<T>) => {
      let call: Observable<BackendSuccessResponse<B>>;
      switch (r.type) {
        case BackendRequestType.GET:
          call = this.http.get<BackendSuccessResponse<B>>(url, { ...options, withCredentials: true });
          break;
        case BackendRequestType.POST:
          call = this.http.post<BackendSuccessResponse<B>>(url, r.data, { ...options, withCredentials: true });
          break;
        case BackendRequestType.PUT:
          call = this.http.put<BackendSuccessResponse<B>>(url, r.data, { ...options, withCredentials: true });
          break;
        case BackendRequestType.DELETE:
          call = this.http.delete<BackendSuccessResponse<B>>(url, { ...options, withCredentials: true });
          break;
        default:
          break;
      }

      return call.pipe(first(), map((d) => d.data),
        tap((data) => this.logger.debug('[BackendResponse]', data)),
        this.retryOnFail()
      );
    }), this.catchErrors());
  }

  public static endpointToURL(endpoint: BackendRequestEndpoint): string {
    let url = '';
    if (typeof endpoint === 'string') {
      url = `/${endpoint}`;
    } else if (Array.isArray(endpoint)) {
      url = `/${endpoint.concat('/')}`;
    } else {
      const query = Object.entries(endpoint.params).map(([ key, val ]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
      url         = `/${endpoint.segments.concat('/')}?${query}`;
    }
    return `${BackendService.api}${url.replace(/([^:]\/)\/+/g, '$1').replace('//', '/')}`;
  }

  private static getAPIUrl(): string {
    const backend  = environment.backend;
    const protocol = backend.protocol === 'auto' ? window.location.protocol : backend.protocol;
    const host     = backend.host === 'auto' ? window.location.host : backend.host;
    return `${protocol}//${backend.prefix}${host}${backend.suffix}`;
  }
}
