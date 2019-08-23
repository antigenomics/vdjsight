import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DropdownComponentState } from 'components/input/dropdown/dropdown.component';
import { DropdownAnimation, DropdownIconAnimation, DropdownListAnimation } from 'components/input/input.animations';
import { fromEvent, ReplaySubject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector:        'vs-dropdown-set',
  templateUrl:     './dropdown-set.component.html',
  styleUrls:       [ './dropdown-set.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ DropdownAnimation, DropdownListAnimation, DropdownIconAnimation ]
})
export class DropdownSetComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  public state         = new ReplaySubject<DropdownComponentState>(1);
  public value: string = '';

  @ViewChild('inputRef', { static: true, read: ElementRef })
  public inputRef: ElementRef;

  @Input()
  public title?: string;

  @Input()
  public available: string[];

  @Input()
  public selected: string[];

  @Output()
  public onSelect = new EventEmitter<string>();

  @Output()
  public onRemove = new EventEmitter<string>();

  @Input()
  public allowSelectionNotFromAvailableList: boolean = true;

  @Input()
  public notFromListSelectionPrefix: string = '';

  @Input()
  public closeOtherDropdownOnFocus: boolean = true;

  @Input()
  public forceUpperCase: boolean = false;

  @Input()
  public forceLowerCase: boolean = false;

  public ngOnInit(): void {
    this.state.next(DropdownComponentState.INACTIVE);
  }

  public switch(event: Event): void {
    event.stopPropagation();
    window.setTimeout(() => {
      this.open();
    });
  }

  public select(value: string, event: Event): void {
    event.stopPropagation();
    if (value !== '') {
      this.value = '';
      this.onSelect.emit(this.forceUpperCase ? value.toLocaleUpperCase() : this.forceLowerCase ? value.toLocaleLowerCase() : value);
      this.close();
    }
  }

  public remove(value: string, event: Event): void {
    event.stopPropagation();
    this.onRemove.emit(value);
  }

  public open(): void {
    this.inputRef.nativeElement.focus();
    this.state.next(DropdownComponentState.ACTIVE);
    this.subscription = fromEvent(window, 'click').pipe(first()).subscribe(() => {
      this.close();
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
