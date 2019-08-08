import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector:        'vs-uploads-entity-name',
  templateUrl:     './uploads-entity-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsEntityNameComponent {
  @Input()
  public pending: boolean;

  @Input()
  public name: string;

  @Output()
  public onNameChange = new EventEmitter<string>();
}
