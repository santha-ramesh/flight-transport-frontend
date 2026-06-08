import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '@shared/models';
import { SortOption } from '@shared/enums';
import { FlightCardComponent } from './flight-card.component';

/**
 * Search Results Component (Dumb Component)
 * Displays list of flights and handles sorting controls
 * Pure presentation - no business logic
 */
@Component({
  selector: 'app-search-results',
  template: `
    <div class="search-results">
      <!-- Sorting Controls -->
      <div class="sorting-section">
        <label>Sort by:</label>
        <div class="sort-buttons">
          <button 
            *ngFor="let option of sortOptions"
            [class.active]="currentSort === option.value"
            (click)="onSortChange(option.value)"
            class="sort-btn">
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="results-info">
        <p>{{ flights.length }} flight{{ flights.length !== 1 ? 's' : '' }} found</p>
      </div>

      <!-- Flight Cards Grid -->
      <div class="flights-grid">
        <app-flight-card 
          *ngFor="let flight of flights; let i = index"
          [flight]="flight"
          [isSelected]="false"
          (selected)="onFlightSelected($event)">
        </app-flight-card>
      </div>
    </div>
  `,
  styleUrls: ['./search-results.component.css'],
  standalone: true,
  imports: [CommonModule, FlightCardComponent]
})
export class SearchResultsComponent {
  @Input() flights: Flight[] = [];
  @Input() currentSort: SortOption = SortOption.PRICE_ASC;
  @Output() flightSelected = new EventEmitter<Flight>();
  @Output() sortChanged = new EventEmitter<SortOption>();

  sortOptions = [
    { label: 'Price (Low to High)', value: SortOption.PRICE_ASC },
    { label: 'Price (High to Low)', value: SortOption.PRICE_DESC },
    { label: 'Duration (Shortest)', value: SortOption.DURATION },
    { label: 'Departure Time (Earliest)', value: SortOption.DEPARTURE }
  ];

  onFlightSelected(flight: Flight): void {
    this.flightSelected.emit(flight);
  }

  onSortChange(sortOption: SortOption): void {
    this.sortChanged.emit(sortOption);
  }
}
