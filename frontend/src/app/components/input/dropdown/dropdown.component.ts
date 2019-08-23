import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DropdownAnimation, DropdownIconAnimation, DropdownListAnimation } from 'components/input/input.animations';
import { fromEvent, ReplaySubject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

export const enum DropdownComponentState {
  ACTIVE   = 'active',
  INACTIVE = 'inactive'
}

@Component({
  selector:        'vs-dropdown',
  templateUrl:     './dropdown.component.html',
  styleUrls:       [ './dropdown.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ DropdownAnimation, DropdownListAnimation, DropdownIconAnimation ]
})
export class DropdownComponent<T> implements OnInit, OnDestroy {
  private subscription?: Subscription;

  public state = new ReplaySubject<DropdownComponentState>(1);

  @Input()
  public title?: string;

  @Input()
  public value: T;

  @Input()
  public values: T[];

  @Output()
  public onSelect = new EventEmitter<T>();

  @Input()
  public closeOtherDropdownOnFocus: boolean = true;

  public ngOnInit(): void {
    this.state.next(DropdownComponentState.INACTIVE);
  }

  public switch(event: Event): void {
    if (!this.closeOtherDropdownOnFocus) {
      event.stopPropagation();
    }
    window.setTimeout(() => {
      this.state.pipe(first()).subscribe((state) => {
        switch (state) {
          case DropdownComponentState.ACTIVE:
            this.close();
            break;
          case DropdownComponentState.INACTIVE:
            this.open();
            break;
          default:
            break;
        }
      });
    });
  }

  public select(value: T, event: Event): void {
    event.stopPropagation();
    this.onSelect.emit(value);
    this.close();
  }

  public open(): void {
    this.state.next(DropdownComponentState.ACTIVE);
    this.subscription = fromEvent(window, 'click').pipe(first()).subscribe(() => {
      window.setTimeout(() => {
        this.close();
      });
    });
  }

  public close(): void {
    this.state.next(DropdownComponentState.INACTIVE);
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
