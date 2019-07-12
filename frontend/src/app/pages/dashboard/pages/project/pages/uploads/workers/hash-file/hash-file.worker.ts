/// <reference lib="webworker" />

import { HashFileWorkerInput, HashFileWorkerOutput } from 'pages/dashboard/pages/project/pages/uploads/workers/hash-file/hash-file';
import { ReactiveWorkerOutputStream, registerReactiveWorker, WorkerContextInterface } from 'utils/worker/reactive-web-worker';

import * as SparkMD5 from 'spark-md5';

type WorkerContext = WorkerContextInterface<HashFileWorkerOutput>;

const ctx = self as any as WorkerContext; // tslint:disable-line:no-any

const DEFAULT_CHUNK_SIZE = 32768;

async function hash(buffer: Blob, spark: any): Promise<string> { // tslint:disable-line:no-any
  return new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.onloadend = async (event) => {
      spark.append((event.target as any).result); // tslint:disable-line:no-any
      resolve();
    };
    reader.readAsArrayBuffer(buffer);
  });
}

function sliceSafe(blob: Blob, from: number, to: number): Blob {
  return blob.slice(from < 0 ? 0 : from, to > blob.size ? blob.size : to);
}

registerReactiveWorker(ctx, async (message: HashFileWorkerInput, stream: ReactiveWorkerOutputStream<HashFileWorkerOutput, WorkerContext>) => {
  const chunkSize      = message.chunkSize || DEFAULT_CHUNK_SIZE;
  const halfChunkSize  = chunkSize / 2;
  const bufferSize     = message.file.size;
  const halfBufferSize = bufferSize / 2;

  const spark = new SparkMD5.ArrayBuffer();

  await hash(sliceSafe(message.file, 0, chunkSize), spark);
  await hash(sliceSafe(message.file, halfBufferSize - halfChunkSize, halfBufferSize + halfChunkSize), spark);
  await hash(sliceSafe(message.file, bufferSize - chunkSize, bufferSize), spark);

  stream.complete({ hash: spark.end() });
});
