import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SampleGeneType, SampleSoftwareType, SampleSpeciesType } from 'pages/dashboard/models/samples/samples';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';

@Component({
  selector:        'vs-uploads-header',
  templateUrl:     './uploads-header.component.html',
  styleUrls:       [ './uploads-header.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsHeaderComponent {
  public availableSoftware = SamplesService.AvailableSoftwareTypes;
  public availableSpecies  = SamplesService.AvailableSpeciesTypes;
  public availableGenes    = SamplesService.AvailableGeneTypes;

  @Input()
  public isUploadForbidden: boolean;

  @Output()
  public onGlobalSoftwareChange = new EventEmitter<SampleSoftwareType>();

  @Output()
  public onGlobalSpeciesChange = new EventEmitter<SampleSpeciesType>();

  @Output()
  public onGlobalGeneChange = new EventEmitter<SampleGeneType>();

  @Output()
  public onUploadAll = new EventEmitter();

  @Output()
  public onRemoveAll = new EventEmitter();
}
