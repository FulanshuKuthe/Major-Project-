import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { appRoutes } from "./app.routes";
import { TokenInterceptor } from "./services/token.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    // Enable class-based HTTP_INTERCEPTORS via DI
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
};
