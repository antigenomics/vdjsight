import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { FilesDialogService } from 'pages/dashboard/pages/project/pages/uploads/services/files-dialog.service';
import { FilesUploaderService } from 'pages/dashboard/pages/project/pages/uploads/services/files-uploader.service';
import {
  EmptyListNoteAnimation,
  UploadsErrorsAnimation,
  UploadsListAnimation,
  UploadsWarningsAnimation
} from 'pages/dashboard/pages/project/pages/uploads/uploads.animations';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector:        'vs-uploads',
  templateUrl:     './uploads.component.html',
  styleUrls:       [ './uploads.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ UploadsListAnimation, EmptyListNoteAnimation, UploadsErrorsAnimation, UploadsWarningsAnimation ]
})
export class ProjectUploadsComponent {
  public readonly extensions = FilesUploaderService.AvailableExtensions;

  public readonly currentProjectInfo$    = this.store.pipe(select(fromDashboardProject.getCurrentProjectInfo));
  public readonly currentProjectUploads$ = this.store.pipe(
    select(fromDashboardProject.getCurrentProjectUUID),
    mergeMap((currentProjectUUID) => this.store.pipe(
      select(fromDashboardProjectUploads.getUploadsForProject, { projectLinkUUID: currentProjectUUID }))
    )
  );

  public readonly errors$   = this.store.pipe(select(fromDashboardProjectUploads.getGlobalErrors));
  public readonly warnings$ = this.store.pipe(select(fromDashboardProjectUploads.getGlobalWarnings));

  public readonly isUploadAllowed$ = this.store.pipe(select(fromDashboardProjectUploads.getGlobalErrors)).pipe(
    map((errors) => errors.length === 0)
  );

  constructor(private readonly store: Store<DashboardProjectUploadModuleState>,
              private readonly files: FilesDialogService, private readonly uploader: FilesUploaderService) {}

  public add(): void {
    this.files.process((files) => {
      this.handleFiles(files);
    });
  }

  public uploadAll(): void {

  }

  public changeName(entity: UploadEntity, name: string): void {
    this.store.dispatch(ProjectUploadsActions.update({ entityId: entity.id, changes: { name } }));
  }

  public remove(entity: UploadEntity): void {
    this.store.dispatch(ProjectUploadsActions.remove({ entityId: entity.id }));
  }

  public handleFiles(files: File[]): void {
    files.forEach((file) => {
      this.uploader.add(file);
    });
  }

  public uploadEntityTrackBy(_: number, entity: UploadEntity): number {
    return entity.id;
  }
}
