import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';

import { ApplicationModule } from './app/application.module';

if (environment.production) {
  enableProdMode();
}

// tslint:disable:no-console
platformBrowserDynamic().bootstrapModule(ApplicationModule).then(() => {
  const version = environment.version;
  const revision = environment.revision;
  console.log(`Application bootstrapped in ${environment.production ? 'production' : 'development'} mode (version: ${version} - ${revision})`);
}).catch((error) => console.error(error));
