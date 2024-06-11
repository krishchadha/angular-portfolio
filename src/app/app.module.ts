import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  // Remove AppComponent from declarations array
})
export class AppModule { }

import { bootstrapApplication } from '@angular/platform-browser'; // Import bootstrapApplication
import { appConfig } from './app.config'; // Adjust the path to app.config
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker'; // Adjust the path to app.component

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
