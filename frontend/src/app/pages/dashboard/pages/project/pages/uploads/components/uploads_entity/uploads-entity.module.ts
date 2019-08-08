import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponentsModule } from 'components/input/input.module';
import { InputDirectivesModule } from 'directives/input/input.module';
import { TooltipModule } from 'directives/tooltip/tooltip.module';
import { HumanReadableSizePipe } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/pipes/human-readable-size.pipe';
import { UploadsEntityComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/uploads-entity.component';
import { UploadsEntityGeneComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/uploads_entity_gene/uploads-entity-gene.component';
import { UploadsEntityNameComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/uploads_entity_name/uploads-entity-name.component';
import { UploadsEntitySoftwareComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/uploads_entity_software/uploads-entity-software.component';
import { UploadsEntitySpeciesComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/uploads_entity_species/uploads-entity-species.component';
import { UploadsEntityStatusComponent } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/uploads_entity_status/uploads-entity-status.component';

@NgModule({
  imports:      [ CommonModule, FormsModule, InputDirectivesModule, InputComponentsModule, TooltipModule ],
  declarations: [
    UploadsEntityComponent,
    UploadsEntityNameComponent,
    UploadsEntitySoftwareComponent,
    UploadsEntitySpeciesComponent,
    UploadsEntityGeneComponent,
    UploadsEntityStatusComponent,
    HumanReadableSizePipe
  ],
  exports:      [ UploadsEntityComponent ]
})
export class UploadsEntityComponentModule {}
