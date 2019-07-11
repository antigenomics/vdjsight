import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from 'pages/dashboard/pages/project/components/sidebar/sidebar.component';

@NgModule({
  imports:      [ CommonModule, RouterModule ],
  declarations: [ SidebarComponent ],
  exports:      [ SidebarComponent ]
})
export class SidebarModule {}
