import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ResetPageComponent } from 'pages/auth/containers/reset_page/reset-page.component';
import { ResetComponent } from 'pages/auth/containers/reset_page/reset/reset.component';
import { ResetFormComponent } from 'pages/auth/containers/reset_page/reset_form/reset-form.component';

@NgModule({
  imports:      [ CommonModule, RouterModule, ReactiveFormsModule, SmoothHeightModule ],
  declarations: [ ResetPageComponent, ResetComponent, ResetFormComponent ],
  exports:      [ ResetPageComponent ]
})
export class ResetPageModule {}
