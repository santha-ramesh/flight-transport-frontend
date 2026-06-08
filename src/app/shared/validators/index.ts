import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';

/**
 * Search Form Validators
 */
export class SearchValidators {
  /**
   * Validates that departure date is not in the past
   */
  static futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selectedDate >= today ? null : { pastDate: true };
    };
  }

  /**
   * Validates that origin and destination are different
   */
  static differentAirportsValidator(
    originControlName: string,
    destinationControlName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const origin = control.get(originControlName);
      const destination = control.get(destinationControlName);

      if (!origin?.value || !destination?.value) {
        return null;
      }

      return origin.value !== destination.value
        ? null
        : { sameAirports: true };
    };
  }

  /**
   * Validates passenger count is between 1 and 9
   */
  static passengerCountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const count = parseInt(control.value, 10);
      return count >= 1 && count <= 9 ? null : { invalidPassengers: true };
    };
  }
}

/**
 * Booking Form Validators
 */
export class BookingValidators {
  /**
   * Validates email format
   */
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(control.value) ? null : { invalidEmail: true };
    };
  }

  /**
   * Validates full name (at least 2 characters, letters and spaces only)
   */
  static fullNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const nameRegex = /^[a-zA-Z\s]{2,}$/;
      return nameRegex.test(control.value) ? null : { invalidFullName: true };
    };
  }

  /**
   * Validates document number based on document type
   * Domestic: National ID (6-20 alphanumeric)
   * International: Passport (6-12 alphanumeric uppercase)
   */
  static documentNumberValidator(isDomestic: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      if (isDomestic) {
        // National ID: ^[A-Za-z0-9]{6,20}$
        const nationalIdRegex = /^[A-Za-z0-9]{6,20}$/;
        return nationalIdRegex.test(control.value)
          ? null
          : { invalidNationalId: true };
      } else {
        // Passport: ^[A-Z0-9]{6,12}$
        const passportRegex = /^[A-Z0-9]{6,12}$/;
        return passportRegex.test(control.value)
          ? null
          : { invalidPassport: true };
      }
    };
  }
}

/**
 * Error Message Mapper
 * Maps validation error codes to user-friendly messages
 */
export class ErrorMessages {
  static getErrorMessage(errorKey: string, fieldName: string = ''): string {
    const messages: { [key: string]: string } = {
      required: `${fieldName} is required`,
      pastDate: 'Departure date cannot be in the past',
      sameAirports: 'Origin and destination must be different',
      invalidPassengers: 'Passengers must be between 1 and 9',
      invalidEmail: 'Please enter a valid email address',
      invalidFullName: 'Full name must contain at least 2 letters',
      invalidNationalId: 'National ID must be 6-20 alphanumeric characters',
      invalidPassport: 'Passport must be 6-12 uppercase alphanumeric characters',
      min: `${fieldName} value is too low`,
      max: `${fieldName} value is too high`,
      minlength: `${fieldName} must be longer`,
      maxlength: `${fieldName} must be shorter`,
      pattern: `${fieldName} format is invalid`
    };

    return messages[errorKey] || `${fieldName} is invalid`;
  }
}
