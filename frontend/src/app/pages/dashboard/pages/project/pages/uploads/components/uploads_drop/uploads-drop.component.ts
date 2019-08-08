import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DropAreaAnimation, DropHelperAnimation } from 'pages/dashboard/pages/project/pages/uploads/components/uploads_drop/uploads-drop.animations';
import { of, Subject, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

const enum DropAreaStates {
  Active   = 'active',
  Inactive = 'inactive'
}

@Component({
  selector:        'div[vs-uploads-drop]',
  templateUrl:     './uploads-drop.component.html',
  styleUrls:       [ './uploads-drop.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ DropAreaAnimation, DropHelperAnimation ]
})
export class UploadsDropComponent implements OnInit {
  private static readonly debounceTime: number = 25;

  public readonly events: Subject<DropAreaStates> = new Subject();

  public readonly state = this.events.asObservable().pipe(
    debounce((event) => {
      if (event === DropAreaStates.Active) {
        return of(0);
      }
      return timer(UploadsDropComponent.debounceTime);
    })
  );

  @Output()
  public onDrop = new EventEmitter<File[]>();


  public ngOnInit(): void {
    setTimeout(() => {
      this.events.next(DropAreaStates.Inactive);
    });
  }

  public onDropListener($event: DragEvent): void {
    $event.preventDefault();
    this.events.next(DropAreaStates.Inactive);
    this.onDrop.emit(Array.from($event.dataTransfer.files));
  }

  public onDragEnterListener($event: DragEvent): void {
    $event.preventDefault();
    this.events.next(DropAreaStates.Active);
  }

  public onDragLeaveListener($event: DragEvent): void {
    $event.preventDefault();
    this.events.next(DropAreaStates.Inactive);
  }

}
