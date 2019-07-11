import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { LoadFailedLabelAnimation, LoadingLabelAnimation } from 'pages/dashboard/pages/project/components/sidebar/sidebar.animations';
import { DashboardProjectModuleState, fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { SampleFileEntity } from 'pages/dashboard/pages/project/models/samples/samples';

@Component({
  selector:        'vs-project-sidebar',
  templateUrl:     './sidebar.component.html',
  styleUrls:       [ './sidebar.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ LoadingLabelAnimation, LoadFailedLabelAnimation ]
})
export class SidebarComponent {
  public readonly isSamplesLoading$    = this.store.pipe(select(fromDashboardProject.isSamplesLoading));
  public readonly isSamplesLoaded$     = this.store.pipe(select(fromDashboardProject.isSamplesLoaded));
  public readonly isSamplesLoadFailed$ = this.store.pipe(select(fromDashboardProject.isSamplesLoadFailed));
  public readonly samples$             = this.store.pipe(select(fromDashboardProject.getAllSamples));

  constructor(private readonly store: Store<DashboardProjectModuleState>) {}

  public sampleFileTrackBy(_: number, entity: SampleFileEntity): number {
    return entity.id;
  }
}
