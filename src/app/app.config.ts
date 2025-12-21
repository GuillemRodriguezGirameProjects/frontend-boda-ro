import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import appConfigJson from '../config.json';
import { routes } from './app.routes';

const jsonUrl = typeof appConfigJson?.backendUrl === 'string' ? appConfigJson.backendUrl : '';
if (!jsonUrl) {
  throw new Error('backendUrl missing in config.json');
}
export const backendUrl = jsonUrl;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
  ],
};
