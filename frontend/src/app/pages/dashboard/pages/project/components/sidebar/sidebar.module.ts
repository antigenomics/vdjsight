import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputComponentsModule } from 'components/input/input.module';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { TooltipModule } from 'directives/tooltip/tooltip.module';
import { SidebarSampleComponent } from 'pages/dashboard/pages/project/components/sidebar/sample/sidebar-sample.component';
import { SidebarSampleUtilsDeleteComponent } from 'pages/dashboard/pages/project/components/sidebar/sample/sidebar_sample_utils_remove/sidebar-sample-utils-delete.component';
import { SidebarSampleUtilsUpdateComponent } from 'pages/dashboard/pages/project/components/sidebar/sample/sidebar_sample_utils_update/sidebar-sample-utils-update.component';
import { SidebarComponent } from 'pages/dashboard/pages/project/components/sidebar/sidebar.component';

@NgModule({
  imports:      [ CommonModule, RouterModule, FormsModule, TooltipModule, SmoothHeightModule, InputComponentsModule ],
  declarations: [ SidebarComponent, SidebarSampleComponent, SidebarSampleUtilsDeleteComponent, SidebarSampleUtilsUpdateComponent ],
  exports:      [ SidebarComponent ]
})
export class SidebarModule {}
