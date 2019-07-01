import { Directive, ElementRef, HostBinding, HostListener, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[smoothHeight]'
})
export class SmoothHeightDirective implements OnChanges {

  @HostBinding('@smoothHeightAnimation')
  public get animation() {
    return { value: this.pulse, params: { startFrom: this.startHeightFrom, time: this.smoothTime } };
  }

  private pulse: boolean;
  private startHeightFrom: number;

  @Input()
  public smoothTrigger: any; // tslint:disable-line:no-any

  @Input()
  public smoothTime: number = 350;

  // @HostBinding('style.display')
  // public hostDisplayStyle = 'block';

  @HostBinding('style.overflow')
  public hostOverflowStyle = 'hidden';

  constructor(private readonly element: ElementRef) {}

  @HostListener('@smoothHeightAnimation.done')
  public done(): void {
    this.startHeightFrom = this.element.nativeElement.clientHeight;

  }

  public ngOnChanges(): void {
    this.pulse = !this.pulse;
  }

}
