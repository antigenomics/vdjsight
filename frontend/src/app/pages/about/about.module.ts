import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AboutPageComponent } from 'pages/about/about.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ AboutPageComponent ],
  exports:      [ AboutPageComponent ]
})
export class AboutPageModule {}
