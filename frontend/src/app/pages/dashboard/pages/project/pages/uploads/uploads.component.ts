import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromDashboard } from 'pages/dashboard/models/dashboard.state';
import { ProjectsActions } from 'pages/dashboard/models/projects/projects.actions';
import { SampleGeneType, SampleSoftwareType, SampleSpeciesType } from 'pages/dashboard/models/samples/samples';
import { DashboardProjectUploadModuleState, fromDashboardUploads } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { UploadEntity } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { UploadsDialogService } from 'pages/dashboard/pages/project/pages/uploads/services/uploads-dialog.service';
import { UploadsService } from 'pages/dashboard/pages/project/pages/uploads/services/uploads.service';
import {
  EmptyListNoteAnimation,
  UploadsErrorsAnimation,
  UploadsListAnimation,
  UploadsWarningsAnimation
} from 'pages/dashboard/pages/project/pages/uploads/uploads.animations';
import { combineLatest } from 'rxjs';
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

  public readonly currentProjectUploads$           = this.store.pipe(select(fromDashboardUploads.getUploadsForSelectedProject));
  public readonly currentProjectPendingUploads$    = this.store.pipe(select(fromDashboardUploads.getPendingUploadsForCurrentProject));
  public readonly currentProjectFailedUploads$     = this.store.pipe(select(fromDashboardUploads.getFailedUploadsForCurrentProject));
  public readonly isUploadAllowedForCurrentProject = this.store.pipe(select(fromDashboard.isUploadAllowedForSelectedProject));

  public readonly isGlobalErrorsNotEmpty$ = this.store.pipe(select(fromDashboardUploads.isGlobalErrorsNotEmpty));
  public readonly globalErrors$           = this.store.pipe(select(fromDashboardUploads.getGlobalErrors));

  public readonly isGlobalWarningsNotEmpty$ = this.store.pipe(select(fromDashboardUploads.isGlobalWarningsNotEmpty));
  public readonly globalWarnings$           = this.store.pipe(select(fromDashboardUploads.getGlobalWarnings));

  constructor(private readonly store: Store<DashboardProjectUploadModuleState>,
              private readonly files: UploadsDialogService,
              private readonly uploader: UploadsService) {}

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

  public changeSoftware(entity: UploadEntity, software: SampleSoftwareType): void {
    this.store.dispatch(ProjectUploadsActions.update({
      entityId: entity.id,
      changes:  { software },
      check:    false
    }));
  }

  public changeSpecies(entity: UploadEntity, species: SampleSpeciesType): void {
    this.store.dispatch(ProjectUploadsActions.update({
      entityId: entity.id,
      changes:  { species },
      check:    false
    }));
  }

  public changeGene(entity: UploadEntity, gene: SampleGeneType): void {
    this.store.dispatch(ProjectUploadsActions.update({
      entityId: entity.id,
      changes:  { gene },
      check:    false
    }));
  }

  public changeGlobalSoftware(software: SampleSoftwareType): void {
    this.currentProjectPendingUploads$.pipe(first()).subscribe((pending) => {
      pending.forEach((p) => this.changeSoftware(p, software));
    });
  }

  public changeGlobalSpecies(species: SampleSpeciesType): void {
    this.currentProjectPendingUploads$.pipe(first()).subscribe((pending) => {
      pending.forEach((p) => this.changeSpecies(p, species));
    });
  }

  public changeGlobalGene(gene: SampleGeneType): void {
    this.currentProjectPendingUploads$.pipe(first()).subscribe((pending) => {
      pending.forEach((p) => this.changeGene(p, gene));
    });
  }

  public remove(entity: UploadEntity): void {
    this.uploader.remove(entity.id);
  }

  public removeAll(): void {
    combineLatest([
      this.currentProjectPendingUploads$,
      this.currentProjectFailedUploads$
    ]).pipe(first()).subscribe(([ pending, failed ]) => {
      [ ...pending, ...failed ].forEach((p) => this.remove(p));
    });
  }

  public handleFiles(files: File[]): void {
    files.forEach((file) => this.uploader.add(file));
  }

  public uploadEntityTrackBy(_: number, entity: UploadEntity): number {
    return entity.id;
  }

  public close(): void {
    this.store.dispatch(ProjectsActions.toSelectedProjectHome());
  }
}
