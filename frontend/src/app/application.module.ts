import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NavigationBarModule } from 'components/navbar/navbar.module';
import { ShellComponent } from 'components/shell/shell.component';
import { environment } from 'environments/environment';
import { ApplicationEffects } from 'models/application/application.effects';
import { metaReducers, RootReducers } from 'models/root';
import { UserEffects } from 'models/user/user.effects';
import { AboutPageComponent } from 'pages/about/about.component';
import { AboutPageModule } from 'pages/about/about.module';
import { HomePageComponent } from 'pages/home/home.component';
import { HomePageModule } from 'pages/home/home.module';
import { ApplicationComponent } from './application.component';
import { AuthorizedOnlyGuard } from './guards/authorized-only.guard';
import { NonAuthorizedOnlyGuard } from './guards/non-authorized-only.guard';

const ApplicationRouting = RouterModule.forRoot([
  {
    path:      '',
    component: ShellComponent,
    children:  [
      { path: '', component: HomePageComponent },
      { path: 'about', component: AboutPageComponent }
    ]
  },
  {
    path:                  'auth',
    loadChildren:          () => import('./pages/auth/auth.module').then((m) => m.AuthPageModule),
    canLoad:               [ NonAuthorizedOnlyGuard ],
    canActivate:           [ NonAuthorizedOnlyGuard ],
    data:                  { nonAuthorizedOnlyGuardFallbackURL: '/' },
    runGuardsAndResolvers: 'always'
  },
  {
    path:                  'projects',
    loadChildren:          () => import('./pages/projects/projects.module').then((m) => m.ProjectsModule),
    canLoad:               [ AuthorizedOnlyGuard ],
    canActivate:           [ AuthorizedOnlyGuard ],
    data:                  { authorizedOnlyGuardFallbackURL: '/auth/login' },
    runGuardsAndResolvers: 'always'
  }
], { onSameUrlNavigation: 'reload' });

@NgModule({
  imports:      [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    ApplicationRouting, HomePageModule, AboutPageModule,
    StoreModule.forRoot(RootReducers, {
      metaReducers:  metaReducers,
      runtimeChecks: {
        strictStateImmutability:     true,
        strictActionImmutability:    true,
        strictStateSerializability:  true,
        strictActionSerializability: true
      }
    }),
    EffectsModule.forRoot([ ApplicationEffects, UserEffects ]),
    StoreRouterConnectingModule.forRoot({
      stateKey:               'router',
      navigationActionTiming: NavigationActionTiming.PostActivation,
      routerState:            RouterState.Minimal
    }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    NavigationBarModule
  ],
  declarations: [ ApplicationComponent, ShellComponent ],
  bootstrap:    [ ApplicationComponent ]
})
export class ApplicationModule {}
