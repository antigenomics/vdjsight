import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vsHumanReadableSize',
  pure: true
})
export class HumanReadableSizePipe implements PipeTransform {
  public transform(bytes: number): string {
    const threshold = 1024;
    if (Math.abs(bytes) < threshold) {
      return bytes + ' B';
    }
    const units = [ 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB' ];
    let u       = -1;
    do {
      bytes /= threshold;
      ++u;
    } while (Math.abs(bytes) >= threshold && u < units.length - 1);
    return `${bytes.toFixed(1)} ${units[ u ]}`;
  }
}
