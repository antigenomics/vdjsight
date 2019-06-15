import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NavigationBarComponent } from 'components/navbar/navbar.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ NavigationBarComponent ],
  exports:      [ NavigationBarComponent ]
})
export class NavigationBarModule {}
