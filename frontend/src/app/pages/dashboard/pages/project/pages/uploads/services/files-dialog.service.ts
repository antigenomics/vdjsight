import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface FilesDialogEvent {
  readonly action: (files: File[]) => void;
}

@Injectable()
export class FilesDialogService {
  private readonly _events: Subject<FilesDialogEvent> = new Subject();

  public get events(): Observable<FilesDialogEvent> {
    return this._events.asObservable();
  }

  public process(action: (files: File[]) => void): void {
    this._events.next({ action });
  }
}
