import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '@shared/models';
import { PricePipe, DurationPipe, TimezonePipe, DateOnlyPipe } from '@shared/pipes';

/**
 * Flight Card Component (Dumb Component - Highly Reusable)
 * Displays individual flight information in a card format
 * Can be reused anywhere flights need to be displayed
 */
@Component({
  selector: 'app-flight-card',
  template: `
    <div class="flight-card" [class.selected]="isSelected" (click)="onSelectFlight()">
      <!-- Provider Badge -->
      <div class="flight-provider-badge">{{ flight.provider }}</div>

      <!-- Flight Header -->
      <div class="flight-header">
        <div class="flight-route">
          <span class="airport-code">{{ flight.origin }}</span>
          <span class="arrow">→</span>
          <span class="airport-code">{{ flight.destination }}</span>
        </div>
        <div class="flight-number">{{ flight.flightNumber }}</div>
      </div>

      <!-- Flight Times -->
      <div class="flight-times">
        <div class="time-slot departure">
          <span class="time">{{ flight.departureTime | timezone: 'short' }}</span>
          <span class="label">Departure</span>
        </div>

        <div class="duration">
          <span class="duration-text">{{ flight.durationMinutes | duration }}</span>
        </div>

        <div class="time-slot arrival">
          <span class="time">{{ flight.arrivalTime | timezone: 'short' }}</span>
          <span class="label">Arrival</span>
        </div>
      </div>

      <!-- Flight Details -->
      <div class="flight-details">
        <span class="cabin-class">{{ flight.cabinClass }}</span>
        <span class="date">({{ flight.departureTime | dateOnly }})</span>
      </div>

      <!-- Pricing -->
      <div class="flight-pricing">
        <div class="price-per-passenger">
          <span class="label">Price per passenger:</span>
          <span class="price">{{ flight.pricePerPassenger | price }}</span>
        </div>
        <div class="total-price">
          <span class="label">Total:</span>
          <span class="price highlighted">{{ flight.totalPrice | price }}</span>
        </div>
      </div>

      <!-- Select Button -->
      <button 
        class="btn-select"
        (click)="onSelectFlight()">
        Select Flight
      </button>
    </div>
  `,
  styleUrls: ['./flight-card.component.css'],
  standalone: true,
  imports: [CommonModule, PricePipe, DurationPipe, TimezonePipe, DateOnlyPipe]
})
export class FlightCardComponent {
  @Input() flight!: Flight;
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<Flight>();

  onSelectFlight(): void {
    this.selected.emit(this.flight);
  }
}
