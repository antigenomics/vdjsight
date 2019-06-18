import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ErrorMessageAnimation } from 'pages/auth/animations/error-message.animation';
import { SmoothHeightFormSegmentAnimation } from 'pages/auth/animations/smooth-height-form-segment.animation';

@Component({
  selector:        'vs-verify',
  templateUrl:     './verify.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ ErrorMessageAnimation, SmoothHeightFormSegmentAnimation ]
})
export class VerifyComponent {
  @Input()
  public pending: boolean;

  @Input()
  public error?: string;

  @Input()
  public extra?: string[];
}
