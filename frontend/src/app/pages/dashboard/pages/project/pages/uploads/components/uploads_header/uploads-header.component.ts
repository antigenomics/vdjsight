import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';

@Component({
  selector:        'vs-uploads-header',
  templateUrl:     './uploads-header.component.html',
  styleUrls:       [ './uploads-header.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsHeaderComponent {
  public availableSoftware = SamplesService.AvailableSoftwareTypes;

  @Input()
  public isUploadForbidden: boolean;

  @Output()
  public onGlobalSoftwareChange = new EventEmitter<string>();

  @Output()
  public onUploadAll = new EventEmitter();

  @Output()
  public onRemoveAll = new EventEmitter();
}
