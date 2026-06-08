import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingRequest } from '@shared/models';
import { BookingValidators } from '@shared/validators';

/**
 * Passenger Form Component (Dumb Component)
 * Collects passenger information for booking
 * Dynamically switches between National ID and Passport validation
 */
@Component({
  selector: 'app-passenger-form',
  template: `
    <form [formGroup]="passengerForm" (ngSubmit)="onSubmit()" class="passenger-form">
      <h2>Passenger Details</h2>

      <!-- Full Name -->
      <div class="form-group">
        <label for="fullName">Full Name *</label>
        <input 
          type="text" 
          id="fullName" 
          formControlName="fullName" 
          class="form-control"
          placeholder="Enter your full name"
          required>
        <span 
          *ngIf="hasError('fullName')" 
          class="error-text">
          {{ getErrorMessage('fullName') }}
        </span>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">Email Address *</label>
        <input 
          type="email" 
          id="email" 
          formControlName="email" 
          class="form-control"
          placeholder="Enter your email"
          required>
        <span 
          *ngIf="hasError('email')" 
          class="error-text">
          {{ getErrorMessage('email') }}
        </span>
      </div>

      <!-- Document Number (Dynamic based on domestic/international) -->
      <div class="form-group">
        <label for="documentNumber">
          {{ isDomestic ? 'National ID Number' : 'Passport Number' }} *
        </label>
        <input 
          type="text" 
          id="documentNumber" 
          formControlName="documentNumber" 
          class="form-control"
          [placeholder]="isDomestic ? 'e.g., ABC123456' : 'e.g., N1234567'"
          required>
        <p class="field-hint">
          {{ isDomestic 
            ? '6-20 alphanumeric characters' 
            : '6-12 uppercase alphanumeric characters' }}
        </p>
        <span 
          *ngIf="hasError('documentNumber')" 
          class="error-text">
          {{ getErrorMessage('documentNumber') }}
        </span>
      </div>

      <!-- Flight Type Indicator -->
      <div class="flight-type-badge">
        <span class="badge" [class.domestic]="isDomestic" [class.international]="!isDomestic">
          {{ isDomestic ? '🇩🇴 Domestic Flight' : '🌍 International Flight' }}
        </span>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button 
          type="submit" 
          class="btn btn-primary"
          [disabled]="!passengerForm.valid || isSubmitting">
          {{ isSubmitting ? 'Processing...' : 'Confirm Booking' }}
        </button>
        <button 
          type="button" 
          (click)="resetForm()"
          class="btn btn-secondary"
          [disabled]="isSubmitting">
          Clear
        </button>
      </div>
    </form>
  `,
  styleUrls: ['./passenger-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PassengerFormComponent implements OnInit {
  @Input() flightNumber!: string;
  @Input() provider!: string;
  @Input() passengerCount = 1;
  @Input() isDomestic = false;
  @Input() isSubmitting = false;
  @Output() bookingSubmitted = new EventEmitter<BookingRequest>();

  passengerForm!: FormGroup;
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.passengerForm = this.fb.group({
      fullName: ['', [Validators.required, BookingValidators.fullNameValidator()]],
      email: ['', [Validators.required, BookingValidators.emailValidator()]],
      documentNumber: [
        '',
        [
          Validators.required,
          BookingValidators.documentNumberValidator(this.isDomestic)
        ]
      ]
    });

    // Update document validator when isDomestic changes
    this.passengerForm.get('documentNumber')?.setValidators(
      BookingValidators.documentNumberValidator(this.isDomestic)
    );
    this.passengerForm.get('documentNumber')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.passengerForm.valid) {
      const formValue = this.passengerForm.value;

      const bookingRequest: BookingRequest = {
        flightNumber: this.flightNumber,
        provider: this.provider,
        passengerCount: this.passengerCount,
        fullName: formValue.fullName,
        email: formValue.email,
        documentNumber: formValue.documentNumber
      };

      this.bookingSubmitted.emit(bookingRequest);
    }
  }

  resetForm(): void {
    this.passengerForm.reset();
  }

  hasError(fieldName: string): boolean {
    const field = this.passengerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.passengerForm.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    const errorKey = Object.keys(field.errors)[0];
    const messages: { [key: string]: string } = {
      required: `${fieldName} is required`,
      invalidEmail: 'Please enter a valid email address',
      invalidFullName: 'Full name must contain at least 2 letters',
      invalidNationalId: 'National ID must be 6-20 alphanumeric characters',
      invalidPassport: 'Passport must be 6-12 uppercase alphanumeric characters'
    };

    return messages[errorKey] || `${fieldName} is invalid`;
  }
}
