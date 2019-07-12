import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FilesDialogService } from 'pages/dashboard/pages/project/pages/uploads/services/files-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector:        'vs-files-dialog',
  templateUrl:     './files-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesDialogComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input()
  public extensions: string;

  @ViewChild('FileDialogHandlerForm', { static: true })
  public FileDialogHandlerForm: ElementRef;

  @ViewChild('FileDialogHandler', { static: true })
  public FileDialogHandler: ElementRef;

  constructor(private dialog: FilesDialogService) {}

  public ngOnInit(): void {
    this.subscription = this.dialog.events.subscribe(({ action }) => {
      const target    = this.FileDialogHandler.nativeElement;
      const form      = this.FileDialogHandlerForm.nativeElement;
      target.onchange = (event: Event) => {
        action(Array.from((event.target as HTMLInputElement).files));
        target.onchange = undefined;
        form.reset();
      };
      target.click();
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
