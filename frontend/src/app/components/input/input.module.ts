import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropdownComponent } from 'components/input/dropdown/dropdown.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ DropdownComponent ],
  exports:      [ DropdownComponent ]
})
export class InputComponentsModule {}
