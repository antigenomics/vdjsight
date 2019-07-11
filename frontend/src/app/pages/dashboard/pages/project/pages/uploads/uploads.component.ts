import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { EmptyListNoteAnimation, UploadsListAnimation } from 'pages/dashboard/pages/project/pages/uploads/uploads.animations';
import { mergeMap, take } from 'rxjs/operators';

@Component({
  selector:        'vs-uploads',
  templateUrl:     './uploads.component.html',
  styleUrls:       [ './uploads.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ UploadsListAnimation, EmptyListNoteAnimation ]
})
export class ProjectUploadsComponent {
  public readonly currentProjectUploads$ = this.store.pipe(
    select(fromDashboardProject.getCurrentProjectUUID),
    mergeMap((currentProjectUUID) => this.store.pipe(
      select(fromDashboardProjectUploads.getUploadsForProject, { projectLinkUUID: currentProjectUUID }))
    )
  );


  constructor(private readonly store: Store<DashboardProjectUploadModuleState>) {}

  public add(): void {
    this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID), take(1)).subscribe((currentProjectUUID) => {
      this.store.dispatch(ProjectUploadsActions.add({ projectLinkUUID: currentProjectUUID }));
    });
  }

  public remove(entity: UploadEntity): void {
    this.store.dispatch(ProjectUploadsActions.remove({ entity }));
  }

  public uploadEntityTrackBy(_: number, entity: UploadEntity): number {
    return entity.id;
  }
}
