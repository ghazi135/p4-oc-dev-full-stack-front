import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { customJwtInterceptorFn } from "./interceptors/customJwtInterceptorFn";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([customJwtInterceptorFn]),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]

};
