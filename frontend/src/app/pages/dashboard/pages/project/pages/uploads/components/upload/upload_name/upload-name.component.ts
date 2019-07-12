import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector:        'vs-upload-name',
  templateUrl:     './upload-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadNameComponent {
  @Input()
  public name: string;

  @Output()
  public onNameChange = new EventEmitter<string>();
}
