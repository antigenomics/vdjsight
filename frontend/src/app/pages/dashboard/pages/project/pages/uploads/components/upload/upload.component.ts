import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';

@Component({
  selector:        'vs-upload',
  templateUrl:     './upload.component.html',
  styleUrls:       [ './upload.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent {
  @Input()
  public entity: UploadEntity;

  @Input()
  public isUploadForbidden: boolean;

  @Output()
  public onUpload = new EventEmitter();

  @Output()
  public onRemove = new EventEmitter();

  @Output()
  public onNameChange = new EventEmitter<string>();

  @Output()
  public onSoftwareChange = new EventEmitter<string>();

  public get isUploadEntityReady(): boolean {
    return UploadEntity.isEntityReadyForUpload(this.entity);
  }

  public get isUploadEntityPending(): boolean {
    return UploadEntity.isEntityPending(this.entity);
  }

  public get availableSoftwareTypes(): string[] {
    return SamplesService.AvailableSoftwareTypes;
  }
}
