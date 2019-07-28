import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { filter, first, map, mergeMap } from 'rxjs/operators';

interface RequestWrapper<T> {
  id: number;
  request: T;
}

export class RateLimiter<T> {
  private counter = 0;

  private readonly wrapperStream: Subject<RequestWrapper<T>> = new Subject();
  private readonly tokenChanged: BehaviorSubject<number>;
  private readonly availableTokens: Observable<number>;

  constructor(private readonly timeout: number, private count: number) {
    this.tokenChanged    = new BehaviorSubject(this.count);
    this.availableTokens = this.tokenChanged.pipe(filter(() => this.count > 0));
  }

  public request(request: T): Observable<T> {
    const wrapper = { id: this.counter++, request: request };
    return new Observable((subscriber) => {
      this.wrapperStream.pipe(filter((w) => w.id === wrapper.id), mergeMap((value) => this.availableTokens.pipe(
        first(),
        map(() => {
          this.tokenChanged.next(--this.count);
          timer(this.timeout).subscribe(() => this.tokenChanged.next(++this.count));
          return value;
        })
      ))).subscribe((value) => {
        subscriber.next(value.request);
        subscriber.complete();
      });
      this.wrapperStream.next(wrapper);
    });
  }
}
