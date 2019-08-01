import { AfterViewChecked, Directive, ElementRef, EmbeddedViewRef, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import tippy, { Instance, Options } from 'tippy.js';

@Directive({
  selector: '[vs-tooltip]'
})
export class TooltipDirective<T> implements OnInit, OnDestroy, AfterViewChecked {
  private instance: Instance;
  private view: EmbeddedViewRef<T>;

  @Input('vs-tooltip-context') // tslint:disable-line:no-input-rename
  public context: T;

  @Input('vs-tooltip-options') // tslint:disable-line:no-input-rename
  public options: Options;

  @Input('vs-tooltip')
  public content: TemplateRef<T>;

  constructor(private readonly element: ElementRef) {}

  public ngOnInit(): void {
    this.view = this.content.createEmbeddedView({
      ...this.context,
      open: (duration?: number) => this.instance.show(duration),
      hide: (duration?: number) => this.instance.hide(duration)
    });
    this.view.detectChanges();
    tippy(this.element.nativeElement, {
      content:     this.view.rootNodes[ 0 ],
      trigger:     'click',
      interactive: true,
      animation:   'scale',
      theme:       'light',
      boundary:    'viewport',
      ...this.options
    });
    this.instance = this.element.nativeElement._tippy;
  }

  public ngOnDestroy(): void {
    this.instance.destroy();
    this.view.destroy();
  }

  public ngAfterViewChecked(): void {
    this.view.detectChanges();
    if (this.instance && this.instance.popperInstance) {
      this.instance.popperInstance.update();
    }
  }
}
