import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-dashboard-page',
  templateUrl:     './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {}
