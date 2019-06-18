import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment';
import { RootModuleState } from 'models/root';
import { UserActions } from 'models/user/user.action';
import { Observable } from 'rxjs';
import { catchError, flatMap, map, retryWhen, take } from 'rxjs/operators';
import { BackendRequest, BackendRequestEndpoint, BackendRequestOptions, BackendRequestType } from './backend-request';
import { BackendSuccessResponse, BackendErrorResponse } from './backend-response';
import { HttpStatusCode } from './http-codes';
import { RateLimiter } from './rate-limiter';
import { retryStrategy } from './retry-strategy';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private static readonly rateTimeout: number = environment.backend.limits.timeout;
  private static readonly rateCount: number   = environment.backend.limits.count;
  private static readonly retryCount: number  = environment.backend.limits.retry;

  public static readonly api = BackendService.getAPIUrl();

  private readonly limiter: RateLimiter<BackendRequest<any>> = new RateLimiter(BackendService.rateTimeout, BackendService.rateCount); // tslint:disable-line:no-any

  constructor(private http: HttpClient, private store: Store<RootModuleState>) {}

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

  private next<T, B = T>(request: BackendRequest<T>, options?: BackendRequestOptions): Observable<B> {
    const url = BackendService.endpointToURL(request.endpoint);
    return this.limiter.request(request).pipe(flatMap((r: BackendRequest<T>) => {
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
      return call.pipe(retryWhen(retryStrategy(BackendService.retryCount)), take(1), map((response) => response.data));
    }), catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.UNAUTHORIZED) {
        setTimeout(() => { this.store.dispatch(UserActions.logout()); });
      }
      console.log(error.error);
      throw error.error as BackendErrorResponse;
    }));
  }

  private static getAPIUrl(): string {
    const backend  = environment.backend;
    const protocol = backend.protocol === 'auto' ? window.location.protocol : backend.protocol;
    const host     = backend.host === 'auto' ? window.location.host : backend.host;
    return `${protocol}//${backend.prefix}${host}${backend.suffix}`;
  }

  private static endpointToURL(endpoint: BackendRequestEndpoint): string {
    let url = '';
    if (typeof endpoint === 'string') {
      url = `/${endpoint}/`;
    } else if (Array.isArray(endpoint)) {
      url = `/${endpoint.concat('/')}/`;
    } else {
      const query = Object.entries(endpoint.params).map(([ key, val ]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
      url         = `/${endpoint.segments.concat('/')}?${query}`;
    }
    return `${BackendService.api}${url.replace(/([^:]\/)\/+/g, '$1').replace('//', '/')}`;
  }
}
