import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SmoothHeightModule } from 'directives/smooth_height/smooth-height.module';
import { SidebarSampleComponent } from 'pages/dashboard/pages/project/components/sidebar/sample/sidebar-sample.component';
import { SidebarComponent } from 'pages/dashboard/pages/project/components/sidebar/sidebar.component';
import { TooltipModule } from 'directives/tooltip/tooltip.module';

@NgModule({
  imports:      [ CommonModule, RouterModule, TooltipModule, SmoothHeightModule ],
  declarations: [ SidebarComponent, SidebarSampleComponent ],
  exports:      [ SidebarComponent ]
})
export class SidebarModule {}
