import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChangePageComponent } from 'pages/auth/containers/change_page/change-page.component';
import { ChangePageModule } from 'pages/auth/containers/change_page/change-page.module';
import { LoginPageComponent } from 'pages/auth/containers/login_page/login-page.component';
import { LoginPageModule } from 'pages/auth/containers/login_page/login-page.module';
import { ResetPageComponent } from 'pages/auth/containers/reset_page/reset-page.component';
import { ResetPageModule } from 'pages/auth/containers/reset_page/reset-page.module';
import { SignupPageComponent } from 'pages/auth/containers/signup_page/signup-page.component';
import { SignupPageModule } from 'pages/auth/containers/signup_page/signup-page.module';
import { VerifyPageComponent } from 'pages/auth/containers/verify_page/verify-page.component';
import { VerifyPageModule } from 'pages/auth/containers/verify_page/verify-page.module';
import { AuthPagesModuleReducers } from 'pages/auth/models/auth-pages.state';
import { ChangePageEffects } from 'pages/auth/models/change_page/change-page.effects';
import { LoginPageEffects } from 'pages/auth/models/login_page/login-page.effects';
import { ResetPageEffects } from 'pages/auth/models/reset_page/reset-page.effects';
import { SignupPageEffects } from 'pages/auth/models/signup_page/signup-page.effects';
import { VerifyPageEffects } from 'pages/auth/models/verify_page/verify-page.effects';

export const AuthModuleRouting = RouterModule.forChild([
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'reset', component: ResetPageComponent },
  { path: 'change/:token', component: ChangePageComponent },
  { path: 'verify/:token', component: VerifyPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
]);


@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, AuthModuleRouting,
    StoreModule.forFeature('auth', AuthPagesModuleReducers),
    EffectsModule.forFeature([ LoginPageEffects, SignupPageEffects, ResetPageEffects, ChangePageEffects, VerifyPageEffects ]),
    LoginPageModule, SignupPageModule, ResetPageModule, ChangePageModule, VerifyPageModule
  ]
})
export class AuthPageModule {}
