import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginPageComponent } from 'pages/auth/containers/login_page/login-page.component';
import { LoginFormComponent } from 'pages/auth/containers/login_page/login_form/login-form.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ LoginPageComponent, LoginFormComponent ],
  exports:      [ LoginPageComponent ]
})
export class LoginPageModule {}
