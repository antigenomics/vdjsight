import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SampleEntity } from 'pages/dashboard/models/samples/samples';
import { Observable, of } from 'rxjs';

@Injectable()
export class SampleResolverService implements Resolve<SampleEntity | undefined> {

  // constructor(private readonly store: Store<DashboardProjectModuleState>) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SampleEntity | undefined> {
    // return this.store.pipe(select(fromDashboardProject.getSamplesForProject))
    console.log(route, state);
    return of(undefined);
  }

}
