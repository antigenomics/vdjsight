import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ErrorAnimation,
  ProgressAnimation,
  ProgressBarAnimation,
  WarningAnimation
} from 'pages/dashboard/pages/project/pages/uploads/components/uploads_entity/uploads_entity_status/uploads-entity-status.animations';

@Component({
  selector:        'vs-uploads-entity-status',
  templateUrl:     './uploads-entity-status.component.html',
  styleUrls:       [ './uploads-entity-status.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ WarningAnimation, ErrorAnimation, ProgressAnimation, ProgressBarAnimation ]
})
export class UploadsEntityStatusComponent {
  @Input()
  public warning?: string;

  @Input()
  public error?: string;

  @Input()
  public uploaded: boolean;

  @Input()
  public uploading: boolean;

  @Input()
  public progress: number;

  public get progressBarState() {
    return { value: this.progress, params: { width: this.progress } };
  }
}
