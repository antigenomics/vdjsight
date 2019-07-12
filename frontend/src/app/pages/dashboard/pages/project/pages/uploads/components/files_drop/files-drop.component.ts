import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DropAreaAnimation, DropHelperAnimation } from 'pages/dashboard/pages/project/pages/uploads/components/files_drop/files-drop.animations';
import { of, Subject, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

const enum DropAreaStates {
  Active   = 'active',
  Inactive = 'inactive'
}

@Component({
  selector:        'div[vs-files-drop]',
  templateUrl:     './files-drop.component.html',
  styleUrls:       [ './files-drop.component.less' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:      [ DropAreaAnimation, DropHelperAnimation ]
})
export class FilesDropComponent implements OnInit {
  private static readonly debounceTime: number = 25;

  public readonly events: Subject<DropAreaStates> = new Subject();

  public readonly state = this.events.asObservable().pipe(
    debounce((event) => {
      if (event === DropAreaStates.Active) {
        return of(0);
      }
      return timer(FilesDropComponent.debounceTime);
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
