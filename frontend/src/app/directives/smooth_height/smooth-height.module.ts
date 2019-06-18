import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoothHeightDirective } from './smooth-height.directive';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ SmoothHeightDirective ],
  exports:      [ SmoothHeightDirective ]
})
export class SmoothHeightModule {}
