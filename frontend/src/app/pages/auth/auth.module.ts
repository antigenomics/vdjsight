import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoginPageComponent } from 'pages/auth/containers/login_page/login-page.component';
import { LoginPageModule } from 'pages/auth/containers/login_page/login-page.module';
import { SignupPageComponent } from 'pages/auth/containers/signup_page/signup-page.component';
import { SignupPageModule } from 'pages/auth/containers/signup_page/signup-page.module';
import { VerifyPageComponent } from 'pages/auth/containers/verify_page/verify-page.component';
import { VerifyPageModule } from 'pages/auth/containers/verify_page/verify-page.module';
import { AuthPagesModuleReducers } from 'pages/auth/models/auth-pages.state';
import { LoginPageEffects } from 'pages/auth/models/login_page/login-page.effects';
import { SignupPageEffects } from 'pages/auth/models/signup_page/signup-page.effects';
import { VerifyPageEffects } from 'pages/auth/models/verify_page/verify-page.effects';

export const AuthModuleRouting = RouterModule.forChild([
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'verify/:token', component: VerifyPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
]);


@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, AuthModuleRouting,
    StoreModule.forFeature('auth', AuthPagesModuleReducers),
    EffectsModule.forFeature([ LoginPageEffects, SignupPageEffects, VerifyPageEffects ]),
    LoginPageModule, SignupPageModule, VerifyPageModule
  ]
})
export class AuthPageModule {}
