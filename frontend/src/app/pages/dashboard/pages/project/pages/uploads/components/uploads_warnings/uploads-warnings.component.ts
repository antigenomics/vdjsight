import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector:        'vs-uploads-warnings',
  templateUrl:     './uploads-warnings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsWarningsComponent {
  @Input()
  public warnings: string[];
}
