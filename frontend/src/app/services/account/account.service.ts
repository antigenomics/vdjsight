import { Injectable } from '@angular/core';
import { UserInfo } from 'models/user/user';
import { Observable } from 'rxjs';
import { BackendService } from '../backend/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private static readonly InfoEndpoint: string = '/account/info';

  constructor(private readonly backend: BackendService) {}

  public info(): Observable<UserInfo> {
    return this.backend.get<void, UserInfo>(AccountService.InfoEndpoint);
  }

}
