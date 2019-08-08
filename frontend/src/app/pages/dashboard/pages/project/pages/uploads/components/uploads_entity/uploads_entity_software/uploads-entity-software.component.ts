import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SampleSoftwareType } from 'pages/dashboard/models/samples/samples';

@Component({
  selector:        'vs-uploads-entity-software',
  templateUrl:     './uploads-entity-software.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsEntitySoftwareComponent {
  @Input()
  public pending: boolean;

  @Input()
  public software: SampleSoftwareType;

  @Input()
  public available: SampleSoftwareType[];

  @Output()
  public onSoftwareChange = new EventEmitter<SampleSoftwareType>();
}
