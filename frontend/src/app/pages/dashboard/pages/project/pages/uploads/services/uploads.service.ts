import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { DashboardProjectUploadModuleState } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { HashFileWorkerInput, HashFileWorkerOutput } from 'pages/dashboard/pages/project/pages/uploads/workers/hash-file/hash-file';
import { first } from 'rxjs/operators';
import { NotificationsService } from 'services/notifications/notifications.service';
import { FileUtils } from 'utils/utils';
import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';
import { ReactiveWebWorker } from 'utils/worker/reactive-web-worker';

@Injectable()
export class UploadsService {
  public static readonly AvailableExtensions = [ '.txt', '.gz' ];

  private readonly uploadEntitiesLocalUUIDGenerator = new IncrementalUUIDGenerator();
  private readonly hashFileWorker                   = new Worker(`./../workers/hash-file/hash-file.worker`, { type: `module` });
  private readonly hashFileReactiveWorker           = new ReactiveWebWorker<HashFileWorkerInput, HashFileWorkerOutput>(this.hashFileWorker);

  private readonly files: Map<number, File> = new Map<number, File>();

  constructor(private readonly store: Store<DashboardProjectUploadModuleState>,
              private readonly notifications: NotificationsService) {}

  public add(file: File): void {
    if (UploadsService.AvailableExtensions.some((v) => file.name.endsWith(v))) {
      this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID), first()).subscribe((currentProjectUUID) => {
        const entityId = this.uploadEntitiesLocalUUIDGenerator.next();
        this.store.dispatch(ProjectUploadsActions.add({
          entityId:        entityId,
          projectLinkUUID: currentProjectUUID,
          name:            FileUtils.eraseExtensions(file.name, UploadsService.AvailableExtensions),
          extension:       FileUtils.getLastExtension(file.name),
          software:        'VDJtools',
          size:            file.size
        }));
        this.hashFileReactiveWorker.next({ file }).subscribe(({ hash }) => {
          this.store.dispatch(ProjectUploadsActions.update({ entityId, changes: { hash }, check: true }));
        });
        this.files.set(entityId, file);
      });
    } else {
      this.notifications.warning('Invalid extension', file.name);
    }
  }

  public upload(entityId: number): void {
    this.store.dispatch(ProjectUploadsActions.upload({ entityId }));
  }

  public remove(entityId: number): void {
    this.store.dispatch(ProjectUploadsActions.remove({ entityId: entityId }));
    this.files.delete(entityId);
  }

  public fileFor(entityId: number): File {
    return this.files.get(entityId);
  }

}
