import { Injectable } from '@angular/core';
import { OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { ApplicationActions } from 'models/application/application.actions';
import { LoggerService } from 'utils/logger/logger.service';


@Injectable()
export class ApplicationEffects implements OnInitEffects {

  constructor(private readonly logger: LoggerService) {}

  public ngrxOnInitEffects(): Action {
    this.logger.info('Application initialization');
    return ApplicationActions.initialize();
  }

}
