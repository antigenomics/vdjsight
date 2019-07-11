export class IncrementalUUIDGenerator {
  private uuid: number = 0;

  public next(): number {
    return this.uuid++;
  }

}
