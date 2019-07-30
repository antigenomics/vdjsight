import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-sample-home',
  templateUrl:     './sample-home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleHomeComponent {}
