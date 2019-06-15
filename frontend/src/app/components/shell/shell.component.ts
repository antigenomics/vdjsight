import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vs-shell',
  template: `
                <vs-navigation-bar></vs-navigation-bar>
                <router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent {}
