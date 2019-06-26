import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[enter-input]'
})
export class EnterInputDirective<T> {
  private input: T = undefined;

  @Input()
  public emitEnterEventOnFocusOut = true;

  @Output()
  public onEnterPressed = new EventEmitter<T>();

  @HostListener('ngModelChange', [ '$event' ])
  public changes($event: T) {
    this.input = $event;
  }

  @HostListener('keypress', [ '$event' ])
  public press($event: KeyboardEvent) {
    if ($event.key === 'Enter' || $event.keyCode === 13) { // tslint:disable-line:no-magic-numbers
      this.onEnterPressed.emit(this.input);
    }
  }

  @HostListener('focusout')
  public focusout() {
    this.onEnterPressed.emit(this.input);
  }
}
