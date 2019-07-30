import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { LoadFailedLabelAnimation, LoadingLabelAnimation } from 'pages/dashboard/pages/project/components/sidebar/sidebar.animations';
import { DashboardProjectModuleState, fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';

@Component({
  selector:        'vs-project-sidebar',
  templateUrl:     './sidebar.component.html',
  styleUrls:       [ './sidebar.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ LoadingLabelAnimation, LoadFailedLabelAnimation ]
})
export class SidebarComponent {
  public readonly isSamplesLoading$    = this.store.pipe(select(fromDashboardProject.isSamplesLoadingForCurrentProject));
  public readonly isSamplesLoaded$     = this.store.pipe(select(fromDashboardProject.isSamplesLoadedForCurrentProject));
  public readonly isSamplesLoadFailed$ = this.store.pipe(select(fromDashboardProject.isSamplesLoadFailedForCurrentProject));
  public readonly samples$             = this.store.pipe(select(fromDashboardProject.getSamplesForCurrentProject));

  constructor(private readonly store: Store<DashboardProjectModuleState>,
              private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {}

  public selectSample(entity: SampleEntity): void {
    if (SampleEntity.isEntityLinked(entity)) {
      this.router.navigate([ 's', entity.link.uuid ], { relativeTo: this.activatedRoute });
    }
  }

  public sampleFileTrackBy(_: number, entity: SampleEntity): number {
    return entity.id;
  }
}
