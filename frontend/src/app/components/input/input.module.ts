import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from 'components/input/dropdown/dropdown.component';
import { DropdownSetComponent } from 'components/input/dropdown_set/dropdown-set.component';

@NgModule({
  imports:      [ CommonModule, FormsModule ],
  declarations: [ DropdownComponent, DropdownSetComponent ],
  exports:      [ DropdownComponent, DropdownSetComponent ]
})
export class InputComponentsModule {}
