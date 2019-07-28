import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';
import { SampleFilesService } from 'pages/dashboard/services/sample_files/sample-files.service';

@Component({
  selector:        'vs-upload-header',
  templateUrl:     './header.component.html',
  styleUrls:       [ './header.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesHeaderComponent {
  public availableSoftware = SampleFilesService.AvailableSoftwareTypes;

  @Input()
  public isUploadForbidden: boolean;

  @Output()
  public onGlobalSoftwareChange = new EventEmitter<string>();

  @Output()
  public onUploadAll = new EventEmitter();

  @Output()
  public onRemoveAll = new EventEmitter();
}
