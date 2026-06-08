import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchQuery, Flight } from '@shared/models';
import { SortOption } from '@shared/enums';
import { FlightSearchStore, AirportStore } from '@core/stores';
import { SearchFormComponent } from '../components/search-form.component';
import { SearchResultsComponent } from '../components/search-results.component';
import { LoadingSpinnerComponent, EmptyStateComponent, ErrorAlertComponent } from '@shared/components';

/**
 * Flight Search Page Component (Smart Component - Container)
 * Orchestrates flight search functionality
 * Manages state through stores and coordinates child components
 */
@Component({
  selector: 'app-flight-search-page',
  template: `
    <div class="flight-search-page">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Search Flights</h1>
        <p>Find and book the best flights for your journey</p>
      </div>

      <!-- Search Form (Dumb Component) -->
      <div class="search-section">
        <app-search-form 
          [airports]="airports()"
          (searchSubmitted)="onSearch($event)">
        </app-search-form>
      </div>

      <!-- Loading State -->
      <app-loading-spinner 
        [isLoading]="isLoading()"
        message="Searching for flights...">
      </app-loading-spinner>

      <!-- Error Alert -->
      <app-error-alert 
        *ngIf="error()"
        [message]="error()"
        [dismissible]="true">
      </app-error-alert>

      <!-- Search Results (Dumb Component) -->
      <div *ngIf="!isEmpty() && !isLoading()" class="results-section">
        <app-search-results 
          [flights]="sortedFlights()"
          [currentSort]="sortOption()"
          (flightSelected)="onFlightSelected($event)"
          (sortChanged)="onSortChanged($event)">
        </app-search-results>
      </div>

      <!-- Empty State -->
      <app-empty-state 
        [show]="isEmpty()"
        message="No flights found matching your search criteria.">
      </app-empty-state>
    </div>
  `,
  styleUrls: ['./flight-search-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    SearchFormComponent,
    SearchResultsComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorAlertComponent
  ]
})
export class FlightSearchPageComponent implements OnInit {
  private store = inject(FlightSearchStore);
  private airportStore = inject(AirportStore);
  private router = inject(Router);

  // Expose store signals to template
  sortedFlights = this.store.sortedFlights;
  isLoading = this.store.isLoading$;
  isEmpty = this.store.isEmpty;
  error = this.store.error$;
  sortOption = this.store.sortOption$;
  flights = this.store.flights$;
  airports = this.airportStore.airports$;

  ngOnInit(): void {
    // Reset store when component initializes
    this.store.reset();
  }

  /**
   * Handle flight search submission
   * @param query Search parameters
   */
  onSearch(query: SearchQuery): void {
    this.store.search(query);
  }

  /**
   * Handle flight selection - navigate to booking page
   * @param flight Selected flight
   */
  onFlightSelected(flight: Flight): void {
    this.router.navigate(['/bookings'], {
      state: { selectedFlight: flight }
    });
  }

  /**
   * Handle sort option change
   * @param sortOption New sort option
   */
  onSortChanged(sortOption: SortOption): void {
    this.store.setSortOption(sortOption);
  }
}
