import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { DashboardModuleState, fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { SampleEntity, SampleGeneType, SampleSoftwareType, SampleSpeciesType } from 'pages/dashboard/models/samples/samples';
import { SamplesActions } from 'pages/dashboard/models/samples/samples.actions';
import { LoadFailedLabelAnimation, LoadingLabelAnimation, SamplesListAnimation } from 'pages/dashboard/pages/project/components/sidebar/sidebar.animations';
import { concat, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector:        'vs-project-sidebar',
  templateUrl:     './sidebar.component.html',
  styleUrls:       [ './sidebar.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ LoadingLabelAnimation, LoadFailedLabelAnimation, SamplesListAnimation ]
})
export class SidebarComponent {
  public readonly loadingStatus$ = this.store.pipe(select(fromDashboard.getSamplesLoadingStatus));
  public readonly samples$       = this.store.pipe(select(fromDashboard.getSamplesForSelectedProject));

  constructor(private readonly store: Store<DashboardModuleState>, private readonly route: ActivatedRoute, private readonly router: Router) {}

  public reload(): void {
    this.store.dispatch(SamplesActions.reload());
  }

  public selectSample(entity: SampleEntity): void {
    if (SampleEntity.isEntityLinked(entity)) {
      this.router.navigate([ 's', entity.link.uuid ], { relativeTo: this.route });
    }
  }

  public deleteSample(entity: SampleEntity): void {
    this.store.dispatch(SamplesActions.forceDelete({ entity }));
  }

  public updateSample(entity: SampleEntity, changed: { name: string, software: SampleSoftwareType, species: SampleSpeciesType, gene: SampleGeneType }): void {
    this.store.dispatch(SamplesActions.update({
      entity,
      name:     changed.name,
      software: changed.software,
      species:  changed.species,
      gene:     changed.gene
    }));
  }

  public discardSample(entity: SampleEntity): void {
    this.store.dispatch(SamplesActions.failedDiscard({ entity }));
  }

  public isSelected(entity: SampleEntity): Observable<boolean> {
    return concat(of(entity.link ? this.router.url.includes(entity.link.uuid) : false),
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e: NavigationEnd) => entity.link ? e.url.includes(entity.link.uuid) : false),
        distinctUntilChanged()
      )
    );
  }

  public sampleFileTrackBy(_: number, entity: SampleEntity): number {
    return entity.id;
  }
}
