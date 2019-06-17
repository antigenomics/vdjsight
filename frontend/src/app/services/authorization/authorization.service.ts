import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'services/backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private static readonly LoginEndpoint: string  = '/auth/login/';
  private static readonly LogoutEndpoint: string = '/auth/logout/';

  constructor(private backend: BackendService) {}

  public login(email: string, password: string): Observable<void> {
    return this.backend.post<{ email: string, password: string }, void>(AuthorizationService.LoginEndpoint, { email, password });
  }

  public logout(): Observable<void> {
    return this.backend.post<void>(AuthorizationService.LogoutEndpoint, void 0);
  }

}
