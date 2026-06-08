import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '@shared/models';
import { PricePipe, DurationPipe, TimezonePipe, DateOnlyPipe } from '@shared/pipes';

/**
 * Booking Summary Component (Dumb Component)
 * Displays flight details and pricing summary for booking confirmation
 */
@Component({
  selector: 'app-booking-summary',
  template: `
    <div class="booking-summary" *ngIf="flight">
      <h2>Flight Summary</h2>

      <!-- Flight Details -->
      <div class="summary-section">
        <div class="summary-row">
          <span class="label">Provider:</span>
          <span class="value">{{ flight.provider }}</span>
        </div>
        <div class="summary-row">
          <span class="label">Flight Number:</span>
          <span class="value">{{ flight.flightNumber }}</span>
        </div>
        <div class="summary-row">
          <span class="label">Route:</span>
          <span class="value">{{ flight.origin }} → {{ flight.destination }}</span>
        </div>
        <div class="summary-row">
          <span class="label">Cabin Class:</span>
          <span class="value">{{ flight.cabinClass }}</span>
        </div>
      </div>

      <!-- Time Details -->
      <div class="summary-section">
        <div class="summary-row">
          <span class="label">Departure:</span>
          <span class="value">
            {{ flight.departureTime | dateOnly }} 
            at {{ flight.departureTime | timezone: 'short' }}
          </span>
        </div>
        <div class="summary-row">
          <span class="label">Arrival:</span>
          <span class="value">
            {{ flight.arrivalTime | dateOnly }} 
            at {{ flight.arrivalTime | timezone: 'short' }}
          </span>
        </div>
        <div class="summary-row">
          <span class="label">Duration:</span>
          <span class="value">{{ flight.durationMinutes | duration }}</span>
        </div>
      </div>

      <!-- Pricing Details -->
      <div class="summary-section pricing">
        <div class="summary-row">
          <span class="label">Price per passenger:</span>
          <span class="value">{{ flight.pricePerPassenger | price }}</span>
        </div>
        <div class="summary-row">
          <span class="label">Number of passengers:</span>
          <span class="value">{{ passengerCount }}</span>
        </div>
        <div class="summary-row total">
          <span class="label">Total Price:</span>
          <span class="value total-price">{{ flight.totalPrice | price }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./booking-summary.component.css'],
  standalone: true,
  imports: [CommonModule, PricePipe, DurationPipe, TimezonePipe, DateOnlyPipe]
})
export class BookingSummaryComponent {
  @Input() flight: Flight | null = null;
  @Input() passengerCount = 1;
}
