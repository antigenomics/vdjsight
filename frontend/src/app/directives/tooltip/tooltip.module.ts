import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipDirective } from 'directives/tooltip/tooltip.directive';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ TooltipDirective ],
  exports:      [ TooltipDirective ]
})
export class TooltipModule {}
