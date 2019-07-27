import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[debounced-input]'
})
export class DebouncedInputDirective<T> implements OnInit, OnDestroy {
  private static readonly DebounceDefaultDelayTime: number = 500;

  private subscription: Subscription;
  private debounced = new Subject<T>();

  @Input()
  public delay: number = DebouncedInputDirective.DebounceDefaultDelayTime;

  @Output()
  public debouncedValue = new EventEmitter();

  @HostListener('ngModelChange', [ '$event' ])
  public changes($event: T) {
    this.debounced.next($event);
  }

  public ngOnInit(): void {
    this.subscription = this.debounced.pipe(
      debounceTime(this.delay),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.debouncedValue.emit(value);
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
