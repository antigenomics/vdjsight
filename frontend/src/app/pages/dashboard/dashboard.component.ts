import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-dashboard-page',
  templateUrl:     './dashboard.component.html',
  styleUrls:       [ './dashboard.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {}
