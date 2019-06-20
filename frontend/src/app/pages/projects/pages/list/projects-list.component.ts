import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-projects-list',
  templateUrl:     './projects-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListComponent {}
