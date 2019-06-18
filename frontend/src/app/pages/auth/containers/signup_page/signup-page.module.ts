import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { SignupPageComponent } from 'pages/auth/containers/signup_page/signup-page.component';
import { SignupComponent } from 'pages/auth/containers/signup_page/signup/signup.component';
import { SignupFormComponent } from 'pages/auth/containers/signup_page/signup_form/signup-form.component';

@NgModule({
  imports:      [ CommonModule, RouterModule, ReactiveFormsModule, SmoothHeightModule ],
  declarations: [ SignupPageComponent, SignupComponent, SignupFormComponent ],
  exports:      [ SignupPageComponent ]
})
export class SignupPageModule {}
