import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';

@Component({
  selector:        'vs-upload-header',
  templateUrl:     './header.component.html',
  styleUrls:       [ './header.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesHeaderComponent {
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
