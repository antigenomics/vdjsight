import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector:        'vs-uploads-entity-software',
  templateUrl:     './uploads-entity-software.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsEntitySoftwareComponent {
  @Input()
  public pending: boolean;

  @Input()
  public software: string;

  @Input()
  public available: string[];

  @Output()
  public onSoftwareChange = new EventEmitter<string>();
}
