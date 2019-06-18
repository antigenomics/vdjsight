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

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private static readonly LoginEndpoint: string  = '/auth/login/';
  private static readonly SignupEndpoint: string = '/auth/signup/';
  private static readonly LogoutEndpoint: string = '/auth/logout/';

  constructor(private backend: BackendService) {}

  public login<C extends LoginCredentials>(credentials: C): Observable<void> {
    return this.backend.post<LoginCredentials, void>(AuthorizationService.LoginEndpoint, credentials);
  }

  public signup<C extends SignupCredentials>(credentials: C): Observable<BackendMessageResponse> {
    return this.backend.post<SignupCredentials, BackendMessageResponse>(AuthorizationService.SignupEndpoint, credentials);
  }

  public logout(): Observable<void> {
    return this.backend.post<void>(AuthorizationService.LogoutEndpoint, void 0);
  }

}
