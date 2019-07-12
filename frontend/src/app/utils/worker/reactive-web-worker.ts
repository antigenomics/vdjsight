import { fromEvent, Observable, Observer } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface ReactiveWorkerInputMessage<I> {
  id: number;
  data: I;
}

export const enum ReactiveWorkerOutputStreamMessageType {
  MESSAGE, ERROR, COMPLETE
}

export interface ReactiveWorkerOutputMessage<O> {
  id: number;
  data?: O;
  error?: string;
  type: ReactiveWorkerOutputStreamMessageType;
}

export class ReactiveWebWorker<I, O> {
  private counter: number = 0;
  private readonly fromWorkerStream: Observable<{ data: ReactiveWorkerOutputMessage<O> }>;

  constructor(private readonly worker: Worker) {
    this.fromWorkerStream = fromEvent<{ data: ReactiveWorkerOutputMessage<O> }>(this.worker, 'message');
  }

  public next(data: I, transfer?: any[]): Observable<O> { // tslint:disable-line:no-any
    const messageId = this.counter++;
    return new Observable((observer: Observer<O>) => {
      this.fromWorkerStream.pipe(
        filter((message: { data: ReactiveWorkerOutputMessage<O> }) => message.data.id === messageId)
      ).subscribe((m) => {
        switch (m.data.type) {
          case ReactiveWorkerOutputStreamMessageType.MESSAGE:
            observer.next(m.data.data);
            break;
          case ReactiveWorkerOutputStreamMessageType.ERROR:
            observer.error(m.data.error);
            break;
          case ReactiveWorkerOutputStreamMessageType.COMPLETE:
            observer.complete();
            break;
          default:
        }
      });
      this.worker.postMessage({ id: messageId, data }, transfer);
    });
  }

  public terminate(): void {
    this.worker.terminate();
  }
}

export interface WorkerContextInterface<O> {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null; // tslint:disable-line:no-any
  postMessage: (message: ReactiveWorkerOutputMessage<O>) => void;
}

export class ReactiveWorkerOutputStream<O, C extends WorkerContextInterface<O>> {
  private isCompleted: boolean = false;

  constructor(private readonly id: number, private readonly ctx: C) {}

  public next(output: O): void {
    this.ctx.postMessage({
      id:   this.id,
      data: output,
      type: ReactiveWorkerOutputStreamMessageType.MESSAGE
    });
  }

  public error(error: string): void {
    this.ctx.postMessage({
      id:    this.id,
      error: error,
      type:  ReactiveWorkerOutputStreamMessageType.ERROR
    });
  }

  public complete(output?: O): void {
    if (this.isCompleted) {
      throw new Error('ReactiveWorkerOutputStream has been already completed.');
    }
    if (output !== undefined) {
      this.next(output);
    }
    if (!this.isCompleted) {
      this.ctx.postMessage({
        id:   this.id,
        type: ReactiveWorkerOutputStreamMessageType.COMPLETE
      });
    }
    this.isCompleted = true;
  }
}

export function registerReactiveWorker<I, O, C extends WorkerContextInterface<O>>(
  ctx: C, callback: (input: I, stream: ReactiveWorkerOutputStream<O, C>, ctx: C) => Promise<void>
) {
  ctx.onmessage = (event: { data: ReactiveWorkerInputMessage<I> }) => {
    const id     = event.data.id;
    const output = new ReactiveWorkerOutputStream(id, ctx);
    callback(event.data.data, output, ctx).catch((e: Error) => {
      output.error(e.message);
    });
  };
}
