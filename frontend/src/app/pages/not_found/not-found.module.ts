import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundPageComponent } from 'pages/not_found/not-found.component';

@NgModule({
  imports:      [ CommonModule, RouterModule ],
  declarations: [ NotFoundPageComponent ],
  exports:      [ NotFoundPageComponent ]
})
export class NotFoundPageModule {}
