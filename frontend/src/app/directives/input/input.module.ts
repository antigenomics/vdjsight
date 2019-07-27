import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DebouncedInputDirective } from 'directives/input/debounced_input/debounced-input.directive';
import { EnterInputDirective } from 'directives/input/enter_input/enter-input.directive';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ DebouncedInputDirective, EnterInputDirective ],
  exports:      [ DebouncedInputDirective, EnterInputDirective ]
})
export class InputDirectivesModule {}
