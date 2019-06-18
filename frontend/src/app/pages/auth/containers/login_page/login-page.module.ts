import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { LoginPageComponent } from 'pages/auth/containers/login_page/login-page.component';
import { LoginFormComponent } from 'pages/auth/containers/login_page/login_form/login-form.component';
import { LoginComponent } from 'pages/auth/containers/login_page/login/login.component';

@NgModule({
  imports:      [ CommonModule, RouterModule, ReactiveFormsModule, SmoothHeightModule ],
  declarations: [ LoginPageComponent, LoginComponent, LoginFormComponent ],
  exports:      [ LoginPageComponent ]
})
export class LoginPageModule {}
