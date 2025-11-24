import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

const myAppConfig = {
  providers: [
    provideRouter(routes) 
  ]
};

bootstrapApplication(AppComponent, myAppConfig)
  .catch((err) => console.error(err));
