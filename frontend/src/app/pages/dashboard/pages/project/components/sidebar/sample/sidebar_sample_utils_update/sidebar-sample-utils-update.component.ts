import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FadeInAnimation } from 'animations/fade-in.animation';
import { SampleGeneType, SampleSoftwareType, SampleSpeciesType } from 'pages/dashboard/models/samples/samples';
import { SamplesService } from 'pages/dashboard/services/samples/samples.service';
import { EntityStatus } from 'utils/state/entity';

@Component({
  selector:        'vs-sidebar-sample-utils-update',
  templateUrl:     './sidebar-sample-utils-update.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ FadeInAnimation ]
})
export class SidebarSampleUtilsUpdateComponent {
  public changed = {
    name:     '',
    software: SamplesService.DefaultSoftwareType,
    species:  SamplesService.DefaultSpeciesType,
    gene:     SamplesService.DefaultGeneType
  };

  @Input()
  public updating: EntityStatus;

  @Input()
  public name: string;

  @Input()
  public software: SampleSoftwareType;

  @Input()
  public species: SampleSpeciesType;

  @Input()
  public gene: SampleGeneType;

  @Output()
  public onUpdate = new EventEmitter<{ name: string, software: SampleSoftwareType, species: SampleSpeciesType, gene: SampleGeneType }>();

  public init(): void {
    this.changed.name     = this.name;
    this.changed.software = this.software;
    this.changed.species  = this.species;
    this.changed.gene     = this.gene;
  }

  public update(): void {
    if (
      this.changed.name !== this.name ||
      this.changed.software !== this.software ||
      this.changed.species !== this.species ||
      this.changed.gene !== this.gene
    ) {
      this.onUpdate.emit(this.changed);
    }

  }

  public get availableSoftwareTypes(): SampleSoftwareType[] {
    return SamplesService.AvailableSoftwareTypes;
  }

  public get availableSpeciesTypes(): SampleSpeciesType[] {
    return SamplesService.AvailableSpeciesTypes;
  }

  public get availableGeneTypes(): SampleGeneType[] {
    return SamplesService.AvailableGeneTypes;
  }
}
