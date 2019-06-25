import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectHighlightedDescriptionAnimation } from 'pages/dashboard/pages/projects/components/highlighted/project-form/project-highlighted-form.animations';

@Component({
  selector:        'vs-highlighted-project-form',
  templateUrl:     './project-highlighted-form.component.html',
  styleUrls:       [ './project-highlighted-form.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ProjectHighlightedDescriptionAnimation ]
})
export class ProjectHighlightedFormComponent {
  private isDescriptionSelected = false;

  @Input()
  public name: string;

  @Input()
  public description: string;

  @Input()
  public isUpdating: boolean;

  @Output()
  public onUpdate = new EventEmitter<{ name: string, description: string }>();

  public get namePlaceholder(): string {
    return this.name !== '' ? this.name : 'Enter project name here...';
  }

  public get descriptionPlaceholder(): string {
    return this.description !== '' ? this.description : 'Enter project description here...';
  }

  public get descriptionState(): string {
    return (this.isDescriptionSelected) ? 'selected' : 'transparent';
  }

  public selectDescription(): void {
    this.isDescriptionSelected = true;
  }

  public deselectDescription(): void {
    this.isDescriptionSelected = false;
  }

  public updateName(name: string) {
    if (name !== '') {
      this.onUpdate.emit({ name, description: this.description });
    }
  }

  public updateDescription(description: string) {
    this.onUpdate.emit({ name: this.name, description });
  }

}
