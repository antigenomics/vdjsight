import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector:        'vs-files-warnings',
  templateUrl:     './files-warnings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesWarningsComponent {
  @Input()
  public warnings: string[];
}
