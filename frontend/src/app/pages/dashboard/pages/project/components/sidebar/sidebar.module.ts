import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidebarComponent } from 'pages/dashboard/pages/project/components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ CommonModule, RouterModule ],
  declarations: [ SidebarComponent ],
  exports:      [ SidebarComponent ]
})
export class SidebarModule {}
