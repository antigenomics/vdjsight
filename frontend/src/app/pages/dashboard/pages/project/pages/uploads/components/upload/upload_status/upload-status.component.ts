import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UploadErrorEntity } from 'pages/dashboard/pages/project/pages/uploads/models/errors/errors';

@Component({
  selector:        'div[vs-upload-status]',
  templateUrl:     './upload-status.component.html',
  styleUrls:       [ './upload-status.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadStatusComponent {
  @Input()
  public error: UploadErrorEntity;
}
