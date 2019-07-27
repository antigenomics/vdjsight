import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProgressBarAnimation, WarningAnimation } from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload_status/upload-status.animations';

@Component({
  selector:        'vs-upload-status',
  templateUrl:     './upload-status.component.html',
  styleUrls:       [ './upload-status.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ WarningAnimation, ProgressBarAnimation ]
})
export class UploadStatusComponent {
  @Input()
  public warning?: string;
}
