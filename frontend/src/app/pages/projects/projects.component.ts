import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-projects-page',
  templateUrl:     './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {}
