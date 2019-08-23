export namespace SequenceUtils {

  export function isPatternValid(pattern: string): boolean {
    const maxPatternLength = 100;

    if (pattern.length === 0) {
      return true;
    }
    if (pattern.length > maxPatternLength) {
      return false;
    }

    let leftBracketStart = false;
    let error            = false;

    const allowedCharacters = 'ARNDCQEGHILKMFPSTWYV';

    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[ i ];
      if (char === '[') {
        if (leftBracketStart === true) {
          error = true;
          break;
        }
        leftBracketStart = true;
      } else if (char === ']') {
        if (leftBracketStart === false) {
          error = true;
          break;
        } else if (pattern[ i - 1 ] === '[') {
          error = true;
          break;
        }
        leftBracketStart = false;
      } else {
        if (char !== 'X' && allowedCharacters.indexOf(char) === -1 || char === ' ') {
          error = true;
          break;
        }
      }
    }
    return !(leftBracketStart || error);
  }

  export function isPatternValidStrict(pattern: string): boolean {
    const maxPatternLength = 100;

    if (pattern.length === 0) {
      return true;
    }

    if (pattern.length > maxPatternLength) {
      return false;
    }

    const allowedCharacters = 'ARNDCQEGHILKMFPSTWYV';

    for (const character of pattern) {
      if (allowedCharacters.indexOf(character) === -1 || character === ' ') {
        return false;
      }
    }
    return true;
  }

  export interface ColorizedPatternRegion {
    readonly part: string;
    readonly color: string;
  }

  export function colorizePattern(input: string, vEnd: number, dStart: number, dEnd: number, jStart: number, divisor: number = 1): ColorizedPatternRegion[] {
    const regions: ColorizedPatternRegion[] = [];

    // tslint:disable:variable-name
    const vend_n = Math.floor(vEnd / divisor);
    let dstart_n = Math.floor(dStart / divisor);
    let dend_n   = Math.floor(dEnd / divisor);
    let jstart_n = Math.floor(jStart / divisor);
    // tslint:enable:variable-name

    while (vend_n >= jstart_n) { jstart_n++; }
    while (dstart_n <= vend_n) { dstart_n++; }
    while (dend_n >= jstart_n) { dend_n--; }

    let str = input;

    if (vend_n > 0) {
      regions.push({ part: str.substring(0, vend_n), color: '#4daf4a' });
      str = str.substring(vend_n);

      dstart_n -= vend_n;
      dend_n -= vend_n;
      jstart_n -= vend_n;
    }

    if (dstart_n >= 0 && dend_n > dstart_n) {
      if (dstart_n > 0) {
        regions.push({ part: str.substring(0, dstart_n), color: 'black' });
      }
      regions.push({ part: str.substring(dstart_n, dend_n), color: '#fdae6b' });

      str = str.substring(dend_n);
      jstart_n -= dend_n;
    }

    if (jstart_n >= 0) {
      if (jstart_n > 0) {
        regions.push({ part: str.substring(0, jstart_n), color: 'black' });
      }
      regions.push({ part: str.substring(jstart_n), color: '#377eb8' });
    } else {
      regions.push({ part: str, color: 'black' });
    }

    return regions;
  }

}
