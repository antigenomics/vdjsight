import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';

@Component({
  selector:        'vs-upload',
  templateUrl:     './upload.component.html',
  styleUrls:       [ './upload.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadComponent {
  @Input()
  public upload: UploadEntity;
}
