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

}
