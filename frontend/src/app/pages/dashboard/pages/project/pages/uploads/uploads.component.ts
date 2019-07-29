import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { DashboardProjectUploadModuleState, fromDashboardProjectUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { FilesDialogService } from 'pages/dashboard/pages/project/pages/uploads/services/files-dialog.service';
import { UploadsService } from 'pages/dashboard/pages/project/pages/uploads/services/uploads.service';
import {
  EmptyListNoteAnimation,
  UploadsErrorsAnimation,
  UploadsListAnimation,
  UploadsWarningsAnimation
} from 'pages/dashboard/pages/project/pages/uploads/uploads.animations';
import { first } from 'rxjs/operators';

@Component({
  selector:        'vs-project-uploads',
  templateUrl:     './uploads.component.html',
  styleUrls:       [ './uploads.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ UploadsListAnimation, EmptyListNoteAnimation, UploadsErrorsAnimation, UploadsWarningsAnimation ]
})
export class ProjectUploadsComponent {
  public readonly extensions = UploadsService.AvailableExtensions;

  public readonly currentProjectUploads$           = this.store.pipe(select(fromDashboardProjectUploads.getUploadsForCurrentProject));
  public readonly currentProjectPendingUploads$    = this.store.pipe(select(fromDashboardProjectUploads.getPendingUploadsForCurrentProject));
  public readonly isUploadAllowedForCurrentProject = this.store.pipe(select(fromDashboardProject.isUploadAllowedForCurrentProject));

  public readonly isGlobalErrorsNotEmpty$ = this.store.pipe(select(fromDashboardProjectUploads.isGlobalErrorsNotEmpty));
  public readonly globalErrors$           = this.store.pipe(select(fromDashboardProjectUploads.getGlobalErrors));

  public readonly isGlobalWarningsNotEmpty$ = this.store.pipe(select(fromDashboardProjectUploads.isGlobalWarningsNotEmpty));
  public readonly globalWarnings$           = this.store.pipe(select(fromDashboardProjectUploads.getGlobalWarnings));

  constructor(private readonly store: Store<DashboardProjectUploadModuleState>,
              private readonly files: FilesDialogService,
              private readonly uploader: UploadsService,
              private readonly router: Router) {}

  public add(): void {
    this.files.process((files) => this.handleFiles(files));
  }

  public upload(entity: UploadEntity): void {
    this.uploader.upload(entity.id);
  }

  public uploadAll(): void {
    this.currentProjectPendingUploads$.pipe(first()).subscribe((pending) => {
      pending.forEach((p) => this.upload(p));
    });
  }

  public changeName(entity: UploadEntity, name: string): void {
    this.store.dispatch(ProjectUploadsActions.update({
      entityId: entity.id,
      changes:  { name: name.replace(/ /g, '') },
      check:    true
    }));
  }

  public changeSoftware(entity: UploadEntity, software: string): void {
    this.store.dispatch(ProjectUploadsActions.update({
      entityId: entity.id,
      changes:  { software },
      check:    false
    }));
  }

  public changeGlobalSoftware(software: string): void {
    this.currentProjectPendingUploads$.pipe(first()).subscribe((pending) => {
      pending.forEach((p) => this.changeSoftware(p, software));
    });
  }

  public remove(entity: UploadEntity): void {
    this.uploader.remove(entity.id);
  }

  public removeAll(): void {
    this.currentProjectPendingUploads$.pipe(first()).subscribe((pending) => {
      pending.forEach((p) => this.remove(p));
    });
  }

  public handleFiles(files: File[]): void {
    files.forEach((file) => this.uploader.add(file));
  }

  public uploadEntityTrackBy(_: number, entity: UploadEntity): number {
    return entity.id;
  }

  public close(): void {
    const segments = this.router.url.split('/');
    segments.pop();
    this.router.navigate(segments);
  }
}
