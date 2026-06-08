import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Flight, SearchQuery } from '@shared/models';
import { SortOption } from '@shared/enums';
import { FlightApiService } from '@core/services';

/**
 * Flight Search Store
 * Manages flight search state using Angular Signals
 */
@Injectable({ providedIn: 'root' })
export class FlightSearchStore {
  // Writable signals (internal state)
  private flights = signal<Flight[]>([]);
  private isLoading = signal(false);
  private error = signal<string | null>(null);
  private sortOption = signal<SortOption>(SortOption.PRICE_ASC);
  private searchQuery = signal<SearchQuery | null>(null);

  // Readonly selectors
  flights$ = this.flights.asReadonly();
  isLoading$ = this.isLoading.asReadonly();
  error$ = this.error.asReadonly();
  sortOption$ = this.sortOption.asReadonly();
  searchQuery$ = this.searchQuery.asReadonly();

  // Computed signals (derived state)
  sortedFlights = computed(() => this.sortFlights(
    this.flights(),
    this.sortOption()
  ));

  isEmpty = computed(() =>
    this.flights().length === 0 && !this.isLoading()
  );

  flightCount = computed(() => this.flights().length);

  constructor(private flightApi: FlightApiService) {}

  /**
   * Search for flights
   * @param query Search parameters
   */
  search(query: SearchQuery): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.searchQuery.set(query);

    this.flightApi.searchFlights(query).subscribe({
      next: (flights: Flight[]) => {
        this.flights.set(flights);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Flight search error:', error);
        this.error.set('Unable to retrieve flights. Please try again.');
        this.flights.set([]);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Update sort option
   * @param option Sort option
   */
  setSortOption(option: SortOption): void {
    this.sortOption.set(option);
  }

  /**
   * Reset store to initial state
   */
  reset(): void {
    this.flights.set([]);
    this.searchQuery.set(null);
    this.error.set(null);
    this.sortOption.set(SortOption.PRICE_ASC);
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error.set(null);
  }

  /**
   * Sort flights based on selected option
   * @param flights Array of flights to sort
   * @param sortOption Sort criteria
   * @returns Sorted array
   */
  private sortFlights(flights: Flight[], sortOption: SortOption): Flight[] {
    const flightsCopy = [...flights];

    switch (sortOption) {
      case SortOption.PRICE_ASC:
        return flightsCopy.sort((a, b) => a.pricePerPassenger - b.pricePerPassenger);

      case SortOption.PRICE_DESC:
        return flightsCopy.sort((a, b) => b.pricePerPassenger - a.pricePerPassenger);

      case SortOption.DURATION:
        return flightsCopy.sort((a, b) => a.durationMinutes - b.durationMinutes);

      case SortOption.DEPARTURE:
        return flightsCopy.sort((a, b) =>
          new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
        );

      default:
        return flightsCopy;
    }
  }
}

/**
 * Booking Store
 * Manages booking state using Angular Signals
 */
@Injectable({ providedIn: 'root' })
export class BookingStore {
  // Writable signals
  private selectedFlight = signal<Flight | null>(null);
  private isSubmitting = signal(false);
  private bookingReference = signal<string | null>(null);
  private error = signal<string | null>(null);

  // Readonly selectors
  selectedFlight$ = this.selectedFlight.asReadonly();
  isSubmitting$ = this.isSubmitting.asReadonly();
  bookingReference$ = this.bookingReference.asReadonly();
  error$ = this.error.asReadonly();

  // Computed signals
  isBookingConfirmed = computed(() => this.bookingReference() !== null);

  constructor() {}

  /**
   * Select a flight for booking
   * @param flight Flight to book
   */
  selectFlight(flight: Flight): void {
    this.selectedFlight.set(flight);
  }

  /**
   * Set booking reference (simulating booking success)
   * @param reference Booking reference
   */
  setBookingReference(reference: string): void {
    this.bookingReference.set(reference);
  }

  /**
   * Set submitting state
   * @param isSubmitting Submission state
   */
  setIsSubmitting(isSubmitting: boolean): void {
    this.isSubmitting.set(isSubmitting);
  }

  /**
   * Set error message
   * @param error Error message
   */
  setError(error: string | null): void {
    this.error.set(error);
  }

  /**
   * Reset store to initial state
   */
  reset(): void {
    this.selectedFlight.set(null);
    this.bookingReference.set(null);
    this.error.set(null);
    this.isSubmitting.set(false);
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error.set(null);
  }
}

/**
 * Airport Store
 * Manages airport data using Angular Signals
 */
@Injectable({ providedIn: 'root' })
export class AirportStore {
  private airports = signal<any[]>([
    { code: 'NY', name: 'New York', country: 'USA' },
    { code: 'LA', name: 'Los Angeles', country: 'USA' },
    { code: 'CHI', name: 'Chicago', country: 'USA' },
    { code: 'LON', name: 'London', country: 'UK' },
    { code: 'MAN', name: 'Manchester', country: 'UK' },
    { code: 'EDI', name: 'Edinburgh', country: 'UK' }
  ]);

  airports$ = this.airports.asReadonly();

  constructor() {}

  getAirports() {
    return this.airports();
  }

  getAirportByCode(code: string) {
    return this.airports().find(a => a.code === code);
  }
}
