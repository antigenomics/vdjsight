import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector:        'vs-project-sample',
  templateUrl:     './sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSampleComponent implements OnInit, OnDestroy {
  private currentSampleUpdateSubscription: Subscription;

  constructor(private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.currentSampleUpdateSubscription = this.route.params.pipe(map((p) => p.uuid)).subscribe((uuid) => {
      console.log('asd', uuid);
    });
  }

  public ngOnDestroy(): void {

    this.currentSampleUpdateSubscription.unsubscribe();
  }
}
