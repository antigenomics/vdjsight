import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector:        'vs-files-errors',
  templateUrl:     './files-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesErrorsComponent {
  @Input()
  public errors: string[];
}
