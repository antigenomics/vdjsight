import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector:        'vs-uploads-errors',
  templateUrl:     './uploads-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsErrorsComponent {
  @Input()
  public errors: string[];
}
