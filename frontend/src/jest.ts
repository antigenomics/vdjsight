import 'jest-preset-angular';

// tslint:disable:no-null-keyword
(global as any).CSS = null; // tslint:disable-line:no-null-keyword

const mock = () => {
  let storage: any = {};
  return {
    getItem:    (key: any) => key in storage ? storage[ key ] : null,
    setItem:    (key: any, value: any) => storage[ key ] = value || '',
    removeItem: (key: any) => delete storage[ key ],
    clear:      () => storage = {}
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display:    'none',
      appearance: [ '-webkit-appearance' ]
    };
  }
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable:   true,
      configurable: true
    };
  }
});
