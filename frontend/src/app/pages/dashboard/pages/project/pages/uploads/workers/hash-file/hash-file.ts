export interface HashFileWorkerInput {
  file: File;
  chunkSize?: number;
}

export interface HashFileWorkerOutput {
  hash: string;
}
