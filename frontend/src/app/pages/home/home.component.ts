import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector:        'vs-home',
  templateUrl:     './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {}
