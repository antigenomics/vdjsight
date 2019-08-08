import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UploadsDialogService } from 'pages/dashboard/pages/project/pages/uploads/services/uploads-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector:        'vs-uploads-dialog',
  templateUrl:     './uploads-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadsDialogComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input()
  public extensions: string[];

  @ViewChild('UploadsDialogHandlerForm', { static: true })
  public UploadsDialogHandlerForm: ElementRef;

  @ViewChild('UploadsDialogHandler', { static: true })
  public UploadsDialogHandler: ElementRef;

  constructor(private dialog: UploadsDialogService) {}

  public ngOnInit(): void {
    this.subscription = this.dialog.events.subscribe(({ action }) => {
      const target    = this.UploadsDialogHandler.nativeElement;
      const form      = this.UploadsDialogHandlerForm.nativeElement;
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
