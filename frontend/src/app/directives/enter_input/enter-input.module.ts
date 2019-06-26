import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EnterInputDirective } from 'directives/enter_input/enter-input.directive';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ EnterInputDirective ],
  exports:      [ EnterInputDirective ]
})
export class EnterInputModule {}
