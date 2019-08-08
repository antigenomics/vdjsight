import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface UploadsDialogEvent {
  readonly action: (files: File[]) => void;
}

@Injectable()
export class UploadsDialogService {
  private readonly _events: Subject<UploadsDialogEvent> = new Subject();

  public get events(): Observable<UploadsDialogEvent> {
    return this._events.asObservable();
  }

  public process(action: (files: File[]) => void): void {
    this._events.next({ action });
  }
}
