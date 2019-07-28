import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[enter-input]'
})
export class EnterInputDirective<T> implements OnInit, OnDestroy {
  private static readonly DebounceDefaultDelayTime: number = 20;

  private subscription: Subscription;

  private enter    = new Subject();
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
    $event.stopPropagation();
    if ($event.key === 'Enter' || $event.keyCode === 13) { // tslint:disable-line:no-magic-numbers deprecation
      this.enter.next();
      if (this.focusOutOnEnter) {
        this.element.nativeElement.blur();
      }
    }
  }

  @HostListener('focusout')
  public focusout() {
    if (this.emitEnterEventOnFocusOut) {
      this.enter.next();
    }
  }

  public ngOnInit(): void {
    this.subscription = this.enter.pipe(
      debounceTime(EnterInputDirective.DebounceDefaultDelayTime)
    ).subscribe(() => this.onEnterPressed.emit(this.input));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
