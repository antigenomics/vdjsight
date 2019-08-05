import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SampleSpectratypeComponent } from 'pages/dashboard/pages/project/pages/sample/pages/spectratype/sample-spectratype.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ SampleSpectratypeComponent ],
  exports:      [ SampleSpectratypeComponent ]
})
export class SampleSpectratypeModule {}
