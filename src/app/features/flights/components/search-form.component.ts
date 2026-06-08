import { Component, Output, EventEmitter, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchQuery } from '@shared/models';
import { CabinClass } from '@shared/enums';
import { SearchValidators } from '@shared/validators';

/**
 * Search Form Component (Dumb Component)
 * Collects flight search criteria from user
 * No business logic - purely presentational
 */
@Component({
  selector: 'app-search-form',
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="onSubmit()" class="search-form">
      <div class="form-group">
        <label for="origin">From (Origin Airport)</label>
        <select 
          id="origin" 
          formControlName="origin" 
          class="form-control"
          required>
          <option value="" disabled>Select origin airport</option>
          <option 
            *ngFor="let airport of airports"
            [value]="airport.code">
            {{ airport.name }} ({{ airport.code }})
          </option>
        </select>
        <span 
          *ngIf="hasError('origin')" 
          class="error-text">
          {{ getErrorMessage('origin') }}
        </span>
      </div>

      <div class="form-group">
        <label for="destination">To (Destination Airport)</label>
        <select 
          id="destination" 
          formControlName="destination" 
          class="form-control"
          required>
          <option value="" disabled>Select destination airport</option>
          <option 
            *ngFor="let airport of airports"
            [value]="airport.code">
            {{ airport.name }} ({{ airport.code }})
          </option>
        </select>
        <span 
          *ngIf="hasError('destination')" 
          class="error-text">
          {{ getErrorMessage('destination') }}
        </span>
      </div>

      <div class="form-group">
        <label for="departureDate">Departure Date</label>
        <input 
          type="date" 
          id="departureDate" 
          formControlName="departureDate" 
          class="form-control"
          [min]="minDate"
          required>
        <span 
          *ngIf="hasError('departureDate')" 
          class="error-text">
          {{ getErrorMessage('departureDate') }}
        </span>
      </div>

      <div class="form-group">
        <label for="passengers">Passengers</label>
        <select 
          id="passengers" 
          formControlName="passengers" 
          class="form-control"
          required>
          <option *ngFor="let num of passengerOptions" [value]="num">
            {{ num }} {{ num === 1 ? 'Passenger' : 'Passengers' }}
          </option>
        </select>
        <span 
          *ngIf="hasError('passengers')" 
          class="error-text">
          {{ getErrorMessage('passengers') }}
        </span>
      </div>

      <div class="form-group">
        <label for="cabinClass">Cabin Class</label>
        <select 
          id="cabinClass" 
          formControlName="cabinClass" 
          class="form-control"
          required>
          <option *ngFor="let cabin of cabinClasses" [value]="cabin">
            {{ cabin }}
          </option>
        </select>
        <span 
          *ngIf="hasError('cabinClass')" 
          class="error-text">
          {{ getErrorMessage('cabinClass') }}
        </span>
      </div>

      <div class="form-actions">
        <button 
          type="submit" 
          class="btn btn-primary"
          [disabled]="!searchForm.valid">
          Search Flights
        </button>
        <button 
          type="button" 
          (click)="resetForm()"
          class="btn btn-secondary">
          Clear
        </button>
      </div>

      <div 
        *ngIf="searchForm.hasError('sameAirports')"
        class="form-error">
        Origin and destination airports must be different
      </div>
    </form>
  `,
  styleUrls: ['./search-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class SearchFormComponent implements OnInit {
  @Input() airports: any[] = [];
  @Output() searchSubmitted = new EventEmitter<SearchQuery>();

  searchForm!: FormGroup;
  cabinClasses = Object.values(CabinClass);
  passengerOptions = Array.from({ length: 9 }, (_, i) => i + 1);
  minDate: string;

  private fb = inject(FormBuilder);

  constructor() {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group(
      {
        origin: ['', Validators.required],
        destination: ['', Validators.required],
        departureDate: ['', [Validators.required, SearchValidators.futureDateValidator()]],
        passengers: [1, [Validators.required, SearchValidators.passengerCountValidator()]],
        cabinClass: [CabinClass.ECONOMY, Validators.required]
      },
      {
        validators: SearchValidators.differentAirportsValidator('origin', 'destination')
      }
    );
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;
      
      // Convert local date to UTC ISO format
      const departureDate = new Date(formValue.departureDate);
      departureDate.setHours(0, 0, 0, 0);

      const query: SearchQuery = {
        origin: formValue.origin,
        destination: formValue.destination,
        departureDate: departureDate.toISOString(),
        passengers: parseInt(formValue.passengers, 10),
        cabinClass: formValue.cabinClass
      };

      this.searchSubmitted.emit(query);
    }
  }

  resetForm(): void {
    this.searchForm.reset({
      cabinClass: CabinClass.ECONOMY,
      passengers: 1
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.searchForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.searchForm.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    const errorKey = Object.keys(field.errors)[0];
    const messages: { [key: string]: string } = {
      required: `${fieldName} is required`,
      pastDate: 'Departure date cannot be in the past',
      sameAirports: 'Origin and destination must be different',
      invalidPassengers: 'Passengers must be between 1 and 9'
    };

    return messages[errorKey] || `${fieldName} is invalid`;
  }
}
