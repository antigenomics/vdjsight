import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from 'pages/home/home.component';

@NgModule({
  imports:      [ CommonModule, RouterModule ],
  declarations: [ HomePageComponent ],
  exports:      [ HomePageComponent ]
})
export class HomePageModule {}
