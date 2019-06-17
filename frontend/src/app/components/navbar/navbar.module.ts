import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationBarComponent } from 'components/navbar/navbar.component';

@NgModule({
  imports:      [ CommonModule, RouterModule ],
  declarations: [ NavigationBarComponent ],
  exports:      [ NavigationBarComponent ]
})
export class NavigationBarModule {}
