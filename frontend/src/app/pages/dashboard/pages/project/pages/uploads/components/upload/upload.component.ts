import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UploadErrorEntity } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { Observable } from 'rxjs';

@Component({
  selector:        'vs-upload',
  templateUrl:     './upload.component.html',
  styleUrls:       [ './upload.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent {
  @Input()
  public upload: UploadEntity;

  @Output()
  public onRemove = new EventEmitter();

  @Output()
  public onNameChange = new EventEmitter<string>();

  public get error(): Observable<UploadErrorEntity> {
    return this.store.pipe(select(fromDashboardProjectUploads.getErrorsForUploadEntity, { uploadId: this.upload.id }));
  }

  constructor(private readonly store: Store<DashboardProjectUploadModuleState>) {}
}
