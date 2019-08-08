import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SampleGeneType, SampleSoftwareType, SampleSpeciesType } from 'pages/dashboard/models/samples/samples';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';

@Component({
  selector:        'vs-uploads-entity',
  templateUrl:     './uploads-entity.component.html',
  styleUrls:       [ './uploads-entity.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsEntityComponent {
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
  public onSoftwareChange = new EventEmitter<SampleSoftwareType>();

  @Output()
  public onSpeciesChange = new EventEmitter<SampleSpeciesType>();

  @Output()
  public onGeneChange = new EventEmitter<SampleGeneType>();

  public get isUploadEntityReady(): boolean {
    return UploadEntity.isEntityReadyForUpload(this.entity);
  }

  public get isUploadEntityPending(): boolean {
    return UploadEntity.isEntityPending(this.entity);
  }

  public get isUploadEntityFailed(): boolean {
    return UploadEntity.isEntityWithError(this.entity);
  }

  public get availableSoftwareTypes(): SampleSoftwareType[] {
    return SamplesService.AvailableSoftwareTypes;
  }

  public get availableSpeciesTypes(): SampleSpeciesType[] {
    return SamplesService.AvailableSpeciesTypes;
  }

  public get availableGeneTypes(): SampleGeneType[] {
    return SamplesService.AvailableGeneTypes;
  }
}
