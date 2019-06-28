import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FadeInAnimation } from 'animations/fade-in.animation';
import { ProjectSelectedDescriptionAnimation } from 'pages/dashboard/pages/projects/components/selected/project-form/project-selected-form.animations';
import { EntityState } from 'utils/enitity/entity';

@Component({
  selector:        'vs-selected-project-form',
  templateUrl:     './project-selected-form.component.html',
  styleUrls:       [ './project-selected-form.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ProjectSelectedDescriptionAnimation, FadeInAnimation ]
})
export class ProjectSelectedFormComponent {
  private isDescriptionSelected = false;

  @Input()
  public name: string;

  @Input()
  public description: string;

  @Input()
  public updating: EntityState;

  @Input()
  public deleting: EntityState;

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
    if (name && name !== '' && name !== this.name) {
      this.onUpdate.emit({ name, description: this.description });
    }
  }

  public updateDescription(description: string) {
    if (description && description !== this.description) {
      this.onUpdate.emit({ name: this.name, description });
    }
  }

}
