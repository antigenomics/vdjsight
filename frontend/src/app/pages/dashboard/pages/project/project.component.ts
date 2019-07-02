import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector:        'vs-project-page',
  templateUrl:     './project.component.html',
  styleUrls:       [ './project.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent {
  public readonly project$ = this.route.params.pipe(
    mergeMap((p) => {
      console.log(p);
      return this.store.pipe(select(fromDashboard.getProjectByLinkUUID, { linkUUID: p.uuid }));
    })
  );

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<DashboardModuleState>) {
    this.project$.subscribe((p) => console.log(p));
  }

}
