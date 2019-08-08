import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SampleGeneType } from 'pages/dashboard/models/samples/samples';

@Component({
  selector:        'vs-uploads-entity-gene',
  templateUrl:     './uploads-entity-gene.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsEntityGeneComponent {
  @Input()
  public pending: boolean;

  @Input()
  public gene: SampleGeneType;

  @Input()
  public available: SampleGeneType[];

  @Output()
  public onGeneChange = new EventEmitter<SampleGeneType>();
}
