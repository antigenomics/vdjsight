import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DebouncedInputDirective } from 'directives/debounced_input/debounced-input.directive';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ DebouncedInputDirective ],
  exports:      [ DebouncedInputDirective ]
})
export class DebouncedInputModule {}
