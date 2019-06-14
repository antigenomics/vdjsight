import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vs-shell',
  template: `
                <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {}
