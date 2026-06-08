import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

/**
 * Root Application Component (Standalone)
 * Entry point for the entire SkyRoute application
 */
@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <!-- Navigation Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <h1 class="app-title">✈️ SkyRoute</h1>
            <p class="app-subtitle">Flight Search & Booking Platform</p>
          </div>
          <nav class="app-nav">
            <a 
              routerLink="/flights" 
              routerLinkActive="active"
              class="nav-link">
              Search Flights
            </a>
          </nav>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-content">
          <p>&copy; {{ currentYear }} SkyRoute. All rights reserved.</p>
          <p class="footer-subtitle">
            Flight Search & Booking Module | Angular 18 | .NET 10 API
          </p>
        </div>
      </footer>
    </div>
  `,
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink]
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}
