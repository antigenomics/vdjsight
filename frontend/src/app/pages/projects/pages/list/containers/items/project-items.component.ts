import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-project-items',
  templateUrl:     './project-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemsComponent {}
