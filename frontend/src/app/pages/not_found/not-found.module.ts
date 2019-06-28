import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NotFoundPageComponent } from 'pages/not_found/not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ CommonModule, RouterModule ],
  declarations: [ NotFoundPageComponent ],
  exports:      [ NotFoundPageComponent ]
})
export class NotFoundPageModule {}
