import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { DashboardSampleModuleState } from 'pages/dashboard/pages/project/pages/sample/models/dashboard-sample.state';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector:        'vs-project-sample',
  templateUrl:     './sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSampleComponent {
  public loadInfo$ = this.store.pipe(select(fromDashboardProject.getSamplesLoadingInfoForCurrentProject));

  public sample$: Observable<SampleEntity> = this.route.params.pipe(map((p) => p.uuid), switchMap((uuid) => {
    return this.store.pipe(select(fromDashboard.getSampleByLinkUUID, { linkUUID: uuid }));
  }));

  constructor(private readonly route: ActivatedRoute, private readonly store: Store<DashboardSampleModuleState>) {}

}
