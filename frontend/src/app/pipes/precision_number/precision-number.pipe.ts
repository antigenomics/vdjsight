import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precisionNumber',
  pure: true
})
export class PrecisionNumberPipe implements PipeTransform {

  public transform(value: number, precision: number = 2): string {
    return value.toPrecision(precision);
  }

}
