import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendMessageResponse } from 'services/backend/backend-response';
import { BackendService } from 'services/backend/backend.service';

interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

interface SignupCredentials {
  readonly email: string;
  readonly login: string;
  readonly password1: string;
  readonly password2: string;
}

interface ResetCredentials {
  readonly email: string;
}

interface ChangeCredentials {
  readonly token: string;
  readonly password1: string;
  readonly password2: string;
}

interface VerifyCredentials {
  readonly token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private static readonly LoginEndpoint: string  = '/auth/login';
  private static readonly SignupEndpoint: string = '/auth/signup';
  private static readonly ResetEndpoint: string  = '/auth/reset';
  private static readonly ChangeEndpoint: string = '/auth/change';
  private static readonly VerifyEndpoint: string = '/auth/verify';
  private static readonly LogoutEndpoint: string = '/auth/logout';

  constructor(private backend: BackendService) {}

  public login<C extends LoginCredentials>(credentials: C): Observable<void> {
    return this.backend.post<LoginCredentials, void>(AuthorizationService.LoginEndpoint, credentials);
  }

  public signup<C extends SignupCredentials>(credentials: C): Observable<BackendMessageResponse> {
    return this.backend.post<SignupCredentials, BackendMessageResponse>(AuthorizationService.SignupEndpoint, credentials);
  }

  public reset<C extends ResetCredentials>(credentials: C): Observable<BackendMessageResponse> {
    return this.backend.post<ResetCredentials, BackendMessageResponse>(AuthorizationService.ResetEndpoint, credentials);
  }

  public change<C extends ChangeCredentials>(credentials: C): Observable<BackendMessageResponse> {
    return this.backend.post<ChangeCredentials, BackendMessageResponse>(AuthorizationService.ChangeEndpoint, credentials);
  }

  public verify<C extends VerifyCredentials>(credentials: C): Observable<BackendMessageResponse> {
    return this.backend.post<VerifyCredentials, BackendMessageResponse>(AuthorizationService.VerifyEndpoint, credentials);
  }

  public logout(): Observable<void> {
    return this.backend.post<void>(AuthorizationService.LogoutEndpoint, void 0);
  }

}
