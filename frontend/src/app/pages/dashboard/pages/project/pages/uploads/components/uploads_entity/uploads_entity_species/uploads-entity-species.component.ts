import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SampleSpeciesType } from 'pages/dashboard/models/samples/samples';

@Component({
  selector:        'vs-uploads-entity-species',
  templateUrl:     './uploads-entity-species.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsEntitySpeciesComponent {
  @Input()
  public pending: boolean;

  @Input()
  public species: SampleSpeciesType;

  @Input()
  public available: SampleSpeciesType[];

  @Output()
  public onSpeciesChange = new EventEmitter<SampleSpeciesType>();
}
