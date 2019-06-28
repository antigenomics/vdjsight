import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TruncatePipe } from 'pipes/truncate/truncate.pipe';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ TruncatePipe ],
  exports:      [ TruncatePipe ]
})
export class TruncatePipeModule {}
