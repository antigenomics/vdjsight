export interface StateLoadingStatus {
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly loadFailed: boolean;
  readonly error?: string;
}

export namespace StateLoadingStatus {

  export function Initial(): StateLoadingStatus {
    return { loading: false, loaded: false, loadFailed: false };
  }

  export function Loading(): StateLoadingStatus {
    return { loading: true, loaded: false, loadFailed: false };
  }

  export function Loaded(): StateLoadingStatus {
    return { loading: false, loaded: true, loadFailed: false };
  }

  export function LoadFailed(error?: string): StateLoadingStatus {
    return { loading: false, loaded: false, loadFailed: true, error: error };
  }

}
