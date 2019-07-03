import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { ContentAnimation, SidebarAnimation } from 'pages/dashboard/pages/project/project.animations';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector:        'vs-project-page',
  templateUrl:     './project.component.html',
  styleUrls:       [ './project.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ SidebarAnimation, ContentAnimation ]
})
export class ProjectComponent {
  public readonly project$ = this.route.params.pipe(
    mergeMap((p) => this.store.pipe(select(fromDashboard.getProjectByLinkUUID, { linkUUID: p.uuid })))
  );

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<DashboardModuleState>) {}

}
