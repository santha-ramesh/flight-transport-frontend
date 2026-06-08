import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/**
 * Bootstrap the Angular Application
 * Entry point for the SkyRoute Flight Transport application
 */
bootstrapApplication(AppComponent, appConfig)
  .catch(err => {
    console.error('Application bootstrap error:', err);
    // Display error message to user
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial; color: red;">
        <h1>Application Error</h1>
        <p>Failed to load SkyRoute application.</p>
        <p>Please refresh the page or contact support.</p>
      </div>
    `;
  });
