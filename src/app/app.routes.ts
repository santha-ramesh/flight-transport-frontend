import { Routes } from '@angular/router';

/**
 * Application Routes
 * Defines routing for the entire SkyRoute application
 * Uses lazy loading for feature modules to reduce initial bundle size
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/flights',
    pathMatch: 'full'
  },
  {
    path: 'flights',
    loadComponent: () =>
      import('./features/flights/pages/flight-search-page.component').then(
        m => m.FlightSearchPageComponent
      ),
    data: { title: 'Flight Search' }
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('./features/bookings/pages/booking-page.component').then(
        m => m.BookingPageComponent
      ),
    data: { title: 'Complete Booking' }
  },
  {
    path: '**',
    redirectTo: '/flights'
  }
];
