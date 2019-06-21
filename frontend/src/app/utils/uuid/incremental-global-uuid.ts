export namespace IncrementalGlobalUUID {

  let uuid = 0;

  export function next(): number {
    return uuid++;
  }

}
