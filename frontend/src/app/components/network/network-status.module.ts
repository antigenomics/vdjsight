import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NetworkStatusComponent } from 'components/network/network-status.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ NetworkStatusComponent ],
  exports:      [ NetworkStatusComponent ]
})
export class NetworkStatusModule {}
