import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Flight, BookingRequest } from '@shared/models';
import { BookingStore, AirportStore } from '@core/stores';
import { BookingApiService, AirportService } from '@core/services';
import { BookingSummaryComponent } from '../components/booking-summary.component';
import { PassengerFormComponent } from '../components/passenger-form.component';
import { LoadingSpinnerComponent, SuccessAlertComponent, ErrorAlertComponent } from '@shared/components';

/**
 * Booking Page Component (Smart Component - Container)
 * Orchestrates the booking process
 * Manages state and coordinates between booking components
 */
@Component({
  selector: 'app-booking-page',
  template: `
    <div class="booking-page">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Complete Your Booking</h1>
        <p>Review your flight and enter passenger details</p>
      </div>

      <!-- No Flight Selected State -->
      <div *ngIf="!flight()" class="no-flight-state">
        <p>No flight selected. Please search for flights first.</p>
        <button (click)="goBackToSearch()" class="btn btn-primary">
          Back to Search
        </button>
      </div>

      <!-- Booking Content -->
      <div *ngIf="flight()" class="booking-content">
        <!-- Flight Summary (Dumb Component) -->
        <div class="booking-section">
          <app-booking-summary 
            [flight]="flight()"
            [passengerCount]="flight()!.totalPrice / flight()!.pricePerPassenger | number: '1.0-0'">
          </app-booking-summary>
        </div>

        <!-- Passenger Form (Dumb Component) -->
        <div class="booking-section">
          <app-passenger-form 
            [flightNumber]="flight()!.flightNumber"
            [provider]="flight()!.provider"
            [passengerCount]="flight()!.totalPrice / flight()!.pricePerPassenger | number: '1.0-0'"
            [isDomestic]="isDomestic()"
            [isSubmitting]="isSubmitting()"
            (bookingSubmitted)="onBookingSubmit($event)">
          </app-passenger-form>
        </div>

        <!-- Loading State -->
        <app-loading-spinner 
          [isLoading]="isSubmitting()"
          message="Processing your booking...">
        </app-loading-spinner>

        <!-- Success Alert -->
        <app-success-alert 
          *ngIf="bookingReference()"
          [message]="'Booking confirmed! Reference: ' + bookingReference()">
        </app-success-alert>

        <!-- Error Alert -->
        <app-error-alert 
          *ngIf="error()"
          [message]="error()">
        </app-error-alert>

        <!-- Success State -->
        <div *ngIf="bookingReference()" class="booking-success">
          <h2>Booking Confirmed!</h2>
          <div class="booking-reference">
            <p>Your booking reference is:</p>
            <p class="reference-number">{{ bookingReference() }}</p>
          </div>
          <p class="confirmation-message">
            A confirmation email has been sent to your email address.
          </p>
          <button (click)="goBackToSearch()" class="btn btn-primary">
            Search Another Flight
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./booking-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    BookingSummaryComponent,
    PassengerFormComponent,
    LoadingSpinnerComponent,
    SuccessAlertComponent,
    ErrorAlertComponent
  ]
})
export class BookingPageComponent implements OnInit {
  private store = inject(BookingStore);
  private bookingApiService = inject(BookingApiService);
  private airportService = inject(AirportService);
  private router = inject(Router);

  // Expose store signals
  flight = this.store.selectedFlight$;
  isSubmitting = this.store.isSubmitting$;
  bookingReference = this.store.bookingReference$;
  error = this.store.error$;

  isDomestic = (): boolean => {
    const flight = this.flight();
    if (!flight) return false;
    return this.airportService.isDomesticFlight(flight.origin, flight.destination);
  };

  ngOnInit(): void {
    this.initializeFromRouteState();
  }

  /**
   * Initialize component from route state
   * Get the selected flight from router state
   */
  private initializeFromRouteState(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;

    if (state?.selectedFlight) {
      this.store.selectFlight(state.selectedFlight);
    }
  }

  /**
   * Handle booking submission
   * @param bookingRequest Booking details
   */
  onBookingSubmit(bookingRequest: BookingRequest): void {
    this.store.setIsSubmitting(true);
    this.store.clearError();

    this.bookingApiService.createBooking(bookingRequest).subscribe({
      next: (response) => {
        this.store.setBookingReference(response.bookingReference);
        this.store.setIsSubmitting(false);
      },
      error: (error) => {
        console.error('Booking error:', error);
        this.store.setError('Booking could not be completed. Please try again.');
        this.store.setIsSubmitting(false);
      }
    });
  }

  /**
   * Navigate back to flight search
   */
  goBackToSearch(): void {
    this.store.reset();
    this.router.navigate(['/flights']);
  }
}
