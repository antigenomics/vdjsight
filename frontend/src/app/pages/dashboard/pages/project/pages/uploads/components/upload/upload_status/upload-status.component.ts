import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ErrorAnimation,
  ProgressAnimation,
  ProgressBarAnimation,
  WarningAnimation
} from 'pages/dashboard/pages/project/pages/uploads/components/upload/upload_status/upload-status.animations';

@Component({
  selector:        'vs-upload-status',
  templateUrl:     './upload-status.component.html',
  styleUrls:       [ './upload-status.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ WarningAnimation, ErrorAnimation, ProgressAnimation, ProgressBarAnimation ]
})
export class UploadStatusComponent {
  @Input()
  public warning?: string;

  @Input()
  public error?: string;

  @Input()
  public uploaded: boolean;

  @Input()
  public progress: number;

  public get progressBarState() {
    return { value: this.progress, params: { width: this.progress } };
  }
}
