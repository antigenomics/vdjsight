export namespace FileUtils {

  export function eraseExtensions(fileName: string, extensions: string[]): string {
    let erased = fileName;
    let erase  = extensions.find((e) => erased.endsWith(e));
    while (erase !== undefined) {
      erased = erased.slice(0, erased.lastIndexOf(erase));
      erase  = extensions.find((e) => erased.endsWith(e));
    }
    return erased;
  }

  export function getLastExtension(fileName: string): string | undefined {
    const splitted = fileName.split('.');
    if (splitted.length === 1 || (splitted[ 0 ] === '' && splitted.length === 2)) {
      return undefined;
    } else {
      return '.' + splitted.pop().toLocaleLowerCase();
    }
  }

}

export namespace StringUtils {

  export function duplicatesExist(array: string[]): boolean {
    return new Set(array).size !== array.length;
  }

}
