import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[enter-input]'
})
export class EnterInputDirective<T> {
  private input: T = undefined;

  @Input()
  public emitEnterEventOnFocusOut: boolean = true;

  @Input()
  public focusOutOnEnter: boolean = true;

  @Output()
  public onEnterPressed = new EventEmitter<T>();

  constructor(private readonly element: ElementRef) {}

  @HostListener('ngModelChange', [ '$event' ])
  public changes($event: T) {
    this.input = $event;
  }

  @HostListener('keypress', [ '$event' ])
  public press($event: KeyboardEvent) {
    if ($event.key === 'Enter' || $event.keyCode === 13) { // tslint:disable-line:no-magic-numbers
      this.onEnterPressed.emit(this.input);
      if (this.focusOutOnEnter) {
        this.element.nativeElement.blur();
      }
    }
  }

  @HostListener('focusout')
  public focusout() {
    if (this.emitEnterEventOnFocusOut) {
      this.onEnterPressed.emit(this.input);
    }
  }
}
