import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { AuthPagesModuleReducers } from 'pages/auth/models/auth-pages.state';
import { EffectsModule } from '@ngrx/effects';
import { LoginPageEffects } from 'pages/auth/models/login_page/login-page.effects';
import { LoginPageModule } from 'pages/auth/containers/login_page/login-page.module';
import { LoginPageComponent } from 'pages/auth/containers/login_page/login-page.component';

export const AuthModuleRouting = RouterModule.forChild([
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
]);


@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, AuthModuleRouting,
    StoreModule.forFeature('auth', AuthPagesModuleReducers),
    EffectsModule.forFeature([ LoginPageEffects ]),
    LoginPageModule
  ]
})
export class AuthPageModule {}
