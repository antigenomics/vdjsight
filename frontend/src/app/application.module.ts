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
import { NetworkStatusModule } from 'components/network/network-status.module';
import { NotificationsModule } from 'components/notifications/notifications.module';
import { ShellComponent } from 'components/shell/shell.component';
import { environment } from 'environments/environment';
import { AuthorizedOnlyGuard } from 'guards/authorized-only.guard';
import { NonAuthorizedOnlyGuard } from 'guards/non-authorized-only.guard';
import { ApplicationEffects } from 'models/application/application.effects';
import { NetworkEffects } from 'models/network/network.effects';
import { NotificationsEffects } from 'models/notifications/notifications.effects';
import { metaReducers, RootReducers } from 'models/root';
import { UserEffects } from 'models/user/user.effects';
import { AboutPageComponent } from 'pages/about/about.component';
import { AboutPageModule } from 'pages/about/about.module';
import { HomePageComponent } from 'pages/home/home.component';
import { HomePageModule } from 'pages/home/home.module';
import { NotFoundPageComponent } from 'pages/not_found/not-found.component';
import { NotFoundPageModule } from 'pages/not_found/not-found.module';
import { ApplicationComponent } from './application.component';

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
    path:                  'dashboard',
    loadChildren:          () => import('pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canLoad:               [ AuthorizedOnlyGuard ],
    canActivate:           [ AuthorizedOnlyGuard ],
    data:                  { authorizedOnlyGuardFallbackURL: '/auth/login' },
    runGuardsAndResolvers: 'always'
  },
  { path: '**', component: NotFoundPageComponent }
], { onSameUrlNavigation: 'reload' });

@NgModule({
  imports:      [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    ApplicationRouting, HomePageModule, AboutPageModule,
    NotFoundPageModule,
    StoreModule.forRoot(RootReducers, {
      metaReducers:  metaReducers,
      runtimeChecks: {
        strictStateImmutability:     true,
        strictActionImmutability:    true,
        strictStateSerializability:  true,
        strictActionSerializability: true
      }
    }),
    EffectsModule.forRoot([ ApplicationEffects, NotificationsEffects, UserEffects, NetworkEffects ]),
    StoreRouterConnectingModule.forRoot({
      stateKey:               'router',
      navigationActionTiming: NavigationActionTiming.PostActivation,
      routerState:            RouterState.Minimal
    }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    NavigationBarModule, NotificationsModule, NetworkStatusModule
  ],
  declarations: [ ApplicationComponent, ShellComponent ],
  bootstrap:    [ ApplicationComponent ]
})
export class ApplicationModule {}
