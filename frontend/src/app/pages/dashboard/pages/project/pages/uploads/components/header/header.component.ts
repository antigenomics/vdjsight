import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { SampleFilesService } from 'pages/dashboard/services/sample_files/sample-files.service';

@Component({
  selector:        'vs-upload-header',
  templateUrl:     './header.component.html',
  styleUrls:       [ './header.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesHeaderComponent {
  public availableSoftware = SampleFilesService.AvailableSoftwareTypes;

  @Output()
  public onGlobalSoftwareChange = new EventEmitter<string>();
}
