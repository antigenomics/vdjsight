import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { map } from 'rxjs/operators';

@Injectable()
export class ErrorsEffects {

  public update$ = createEffect(() => this.store.pipe(select(fromDashboardProjectUploads.getAllUploads), map((uploads) => {
    console.log(uploads);
  })), { dispatch: false });

  constructor(private readonly store: Store<DashboardProjectUploadModuleState>) {}

}
