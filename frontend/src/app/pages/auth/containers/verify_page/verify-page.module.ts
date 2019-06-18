import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { VerifyPageComponent } from 'pages/auth/containers/verify_page/verify-page.component';
import { VerifyComponent } from 'pages/auth/containers/verify_page/verify/verify.component';

@NgModule({
  imports:      [ CommonModule, RouterModule, SmoothHeightModule ],
  declarations: [ VerifyPageComponent, VerifyComponent ],
  exports:      [ VerifyPageComponent ]
})
export class VerifyPageModule {}
