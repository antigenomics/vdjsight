import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-application-root',
  templateUrl:     './application.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationComponent {

}
