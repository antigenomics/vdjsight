import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrecisionNumberPipe } from 'pipes/precision_number/precision-number.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ PrecisionNumberPipe ],
  exports:      [ PrecisionNumberPipe ]
})
export class PrecisionNumberPipeModule {}
