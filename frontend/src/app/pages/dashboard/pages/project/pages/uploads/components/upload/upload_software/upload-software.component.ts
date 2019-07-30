import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector:        'vs-upload-software',
  templateUrl:     './upload-software.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadSoftwareComponent {
  @Input()
  public pending: boolean;

  @Input()
  public software: string;

  @Input()
  public available: string[];

  @Output()
  public onSoftwareChange = new EventEmitter<string>();
}
