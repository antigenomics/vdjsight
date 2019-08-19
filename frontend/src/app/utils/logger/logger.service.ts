import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

// tslint:disable:no-console no-any
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  // noinspection JSMethodCanBeStatic
  public log(title: any, ...messages: any[]): void {
    console.log(title, ...messages);
  }

  // noinspection JSMethodCanBeStatic
  public info(title: any, ...messages: any[]): void {
    console.info(title, ...messages);
  }

  // noinspection JSMethodCanBeStatic
  public warn(title: any, ...messages: any[]): void {
    console.warn(title, ...messages);
  }

  // noinspection JSMethodCanBeStatic
  public debug(title: any, ...messages: any[]): void {
    if (environment.loggerDebug) {
      console.info(`[Debug] ${title}:`, ...messages);
    }
  }
}

// tslint:enable:no-console no-any
