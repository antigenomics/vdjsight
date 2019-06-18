import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { ChangePageComponent } from 'pages/auth/containers/change_page/change-page.component';
import { ChangeComponent } from 'pages/auth/containers/change_page/change/change.component';
import { ChangeFormComponent } from 'pages/auth/containers/change_page/change_form/change-form.component';

@NgModule({
  imports:      [ CommonModule, RouterModule, ReactiveFormsModule, SmoothHeightModule ],
  declarations: [ ChangePageComponent, ChangeComponent, ChangeFormComponent ],
  exports:      [ ChangePageComponent ]
})
export class ChangePageModule {}
