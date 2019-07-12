import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromDashboardProject } from 'pages/dashboard/pages/project/models/dashboard-project.state';
import { DashboardProjectUploadModuleState } from 'pages/dashboard/pages/project/pages/uploads/models/upload-module.state';
import { ProjectUploadsActions } from 'pages/dashboard/pages/project/pages/uploads/models/uploads/uploads.actions';
import { HashFileWorkerInput, HashFileWorkerOutput } from 'pages/dashboard/pages/project/pages/uploads/workers/hash-file/hash-file';
import { take } from 'rxjs/operators';
import { IncrementalUUIDGenerator } from 'utils/uuid/incremental-uuid-generator';
import { ReactiveWebWorker } from 'utils/worker/reactive-web-worker';

@Injectable()
export class FilesUploaderService {
  private readonly uploadEntitiesLocalUUIDGenerator = new IncrementalUUIDGenerator();
  private readonly hashFileWorker                   = new Worker(`./../workers/hash-file/hash-file.worker`, { type: `module` });
  private readonly hashFileReactiveWorker           = new ReactiveWebWorker<HashFileWorkerInput, HashFileWorkerOutput>(this.hashFileWorker);

  constructor(private readonly store: Store<DashboardProjectUploadModuleState>) {}

  public add(file: File): void {
    this.store.pipe(select(fromDashboardProject.getCurrentProjectUUID), take(1)).subscribe((currentProjectUUID) => {
      const entityId = this.uploadEntitiesLocalUUIDGenerator.next();
      this.store.dispatch(ProjectUploadsActions.add({
        entityId:        entityId,
        projectLinkUUID: currentProjectUUID,
        name:            file.name,
        size:            file.size
      }));
      this.hashFileReactiveWorker.next({ file }).subscribe(({ hash }) => {
        this.store.dispatch(ProjectUploadsActions.setHash({ entityId, hash }));
      });
    });
  }

}
