import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  pure: true
})
export class TruncatePipe implements PipeTransform {

  public transform(value: string, limit: number = 100): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }

}
