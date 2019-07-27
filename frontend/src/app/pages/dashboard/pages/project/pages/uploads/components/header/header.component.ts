import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-upload-header',
  templateUrl:     './header.component.html',
  styleUrls:       [ './header.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesHeaderComponent {}
