import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorMessageAnimation } from 'pages/auth/animations/error-message.animation';
import { FormFooterAnimation } from 'pages/auth/animations/form-footer.animation';
import { InfoMessageAnimation } from 'pages/auth/animations/info-message.animation';
import { SmoothHeightFormSegmentAnimation } from 'pages/auth/animations/smooth-height-form-segment.animation';
import { AuthForms } from 'pages/auth/auth.forms';

@Component({
  selector:        'vs-change',
  templateUrl:     './change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ InfoMessageAnimation, ErrorMessageAnimation, SmoothHeightFormSegmentAnimation, FormFooterAnimation ]
})
export class ChangeComponent {
  @Input()
  public pending: boolean;

  @Input()
  public token: string;

  @Input()
  public error: string;

  @Input()
  public extra?: string[];

  @Output()
  public onSubmit = new EventEmitter<{ token: string, form: AuthForms.ChangeForm }>();
}
