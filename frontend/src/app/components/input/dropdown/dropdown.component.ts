import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DropdownAnimation } from 'components/input/dropdown/dropdown.animations';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector:        'vs-dropdown',
  templateUrl:     './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ DropdownAnimation ]
})
export class DropdownComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public active = new Subject<boolean>();

  @Input()
  public value: string;

  @Input()
  public values: string[];

  @Output()
  public onSelect = new EventEmitter<string>();

  public ngOnInit(): void {
    this.active.next(false);
  }

  public open(event: Event): void {
    event.stopPropagation();
    this.active.next(true);
    this.subscription = fromEvent(window, 'click').pipe(first()).subscribe(() => {
      this.close();
    });
  }

  public select(value: string, event: Event): void {
    event.stopPropagation();
    this.onSelect.emit(value);
    this.close();
  }

  public close(): void {
    this.active.next(false);
    this.subscription.unsubscribe();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
