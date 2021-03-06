import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FadeInAnimation } from 'animations/fade-in.animation';
import { ProjectsListPreviewDescriptionAnimation } from 'pages/dashboard/pages/projects/components/projects_preview/preview_update_form/projects-preview-update-form.animations';
import { EntityStatus } from 'utils/state/entity';

@Component({
  selector:        'vs-projects-preview-update-form',
  templateUrl:     './projects-preview-update-form.component.html',
  styleUrls:       [ './projects-preview-update-form.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ProjectsListPreviewDescriptionAnimation, FadeInAnimation ]
})
export class ProjectsPreviewUpdateFormComponent {
  private isDescriptionSelected = false;

  @Input()
  public name: string;

  @Input()
  public description: string;

  @Input()
  public updating: EntityStatus;

  @Input()
  public deleting: EntityStatus;

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
