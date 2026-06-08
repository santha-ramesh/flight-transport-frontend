import { TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SearchValidators, BookingValidators } from './index';

describe('SearchValidators', () => {
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder]
    });
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe('futureDateValidator', () => {
    it('should accept future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const dateString = futureDate.toISOString().split('T')[0];

      const control = new FormControl(dateString);
      const validator = SearchValidators.futureDateValidator();
      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should reject past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const dateString = pastDate.toISOString().split('T')[0];

      const control = new FormControl(dateString);
      const validator = SearchValidators.futureDateValidator();
      const result = validator(control);

      expect(result).toEqual({ pastDate: true });
    });

    it('should accept today', () => {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];

      const control = new FormControl(dateString);
      const validator = SearchValidators.futureDateValidator();
      const result = validator(control);

      expect(result).toBeNull();
    });
  });

  describe('differentAirportsValidator', () => {
    it('should pass when airports are different', () => {
      const form = formBuilder.group({
        origin: ['NY'],
        destination: ['LON']
      });

      const validator = SearchValidators.differentAirportsValidator('origin', 'destination');
      const result = validator(form);

      expect(result).toBeNull();
    });

    it('should fail when airports are the same', () => {
      const form = formBuilder.group({
        origin: ['NY'],
        destination: ['NY']
      });

      const validator = SearchValidators.differentAirportsValidator('origin', 'destination');
      const result = validator(form);

      expect(result).toEqual({ sameAirports: true });
    });
  });

  describe('passengerCountValidator', () => {
    it('should accept valid passenger counts (1-9)', () => {
      for (let i = 1; i <= 9; i++) {
        const control = new FormControl(i);
        const validator = SearchValidators.passengerCountValidator();
        const result = validator(control);

        expect(result).toBeNull();
      }
    });

    it('should reject passenger count 0', () => {
      const control = new FormControl(0);
      const validator = SearchValidators.passengerCountValidator();
      const result = validator(control);

      expect(result).toEqual({ invalidPassengers: true });
    });

    it('should reject passenger count > 9', () => {
      const control = new FormControl(10);
      const validator = SearchValidators.passengerCountValidator();
      const result = validator(control);

      expect(result).toEqual({ invalidPassengers: true });
    });
  });
});

describe('BookingValidators', () => {
  describe('emailValidator', () => {
    it('should accept valid emails', () => {
      const validEmails = [
        'john@example.com',
        'user.name@domain.co.uk',
        'test+tag@example.org'
      ];

      validEmails.forEach(email => {
        const control = new FormControl(email);
        const validator = BookingValidators.emailValidator();
        const result = validator(control);

        expect(result).toBeNull();
      });
    });

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@example.com',
        'invalid..email@example.com'
      ];

      invalidEmails.forEach(email => {
        const control = new FormControl(email);
        const validator = BookingValidators.emailValidator();
        const result = validator(control);

        expect(result).toEqual({ invalidEmail: true });
      });
    });
  });

  describe('fullNameValidator', () => {
    it('should accept valid full names', () => {
      const validNames = ['John Smith', 'Mary Jane', 'AB'];

      validNames.forEach(name => {
        const control = new FormControl(name);
        const validator = BookingValidators.fullNameValidator();
        const result = validator(control);

        expect(result).toBeNull();
      });
    });

    it('should reject invalid full names', () => {
      const invalidNames = ['A', 'John123', 'John-Smith', 'John_Smith'];

      invalidNames.forEach(name => {
        const control = new FormControl(name);
        const validator = BookingValidators.fullNameValidator();
        const result = validator(control);

        expect(result).toEqual({ invalidFullName: true });
      });
    });
  });

  describe('documentNumberValidator', () => {
    describe('National ID (Domestic)', () => {
      it('should accept valid National IDs', () => {
        const validIds = ['ABC123456', '123456', 'ABCDEF123456'];

        validIds.forEach(id => {
          const control = new FormControl(id);
          const validator = BookingValidators.documentNumberValidator(true);
          const result = validator(control);

          expect(result).toBeNull();
        });
      });

      it('should reject invalid National IDs', () => {
        const invalidIds = [
          'AB', // too short
          'ABCDEF1234567890123456789', // too long
          'ABC@123', // special character
        ];

        invalidIds.forEach(id => {
          const control = new FormControl(id);
          const validator = BookingValidators.documentNumberValidator(true);
          const result = validator(control);

          expect(result).toEqual({ invalidNationalId: true });
        });
      });
    });

    describe('Passport (International)', () => {
      it('should accept valid Passports', () => {
        const validPassports = ['N1234567', 'ABCDEF123456'];

        validPassports.forEach(passport => {
          const control = new FormControl(passport);
          const validator = BookingValidators.documentNumberValidator(false);
          const result = validator(control);

          expect(result).toBeNull();
        });
      });

      it('should reject invalid Passports', () => {
        const invalidPassports = [
          'n1234567', // lowercase
          'ABC12', // too short
          'ABCDEFGHIJKLMN', // too long
          'ABC123@456' // special character
        ];

        invalidPassports.forEach(passport => {
          const control = new FormControl(passport);
          const validator = BookingValidators.documentNumberValidator(false);
          const result = validator(control);

          expect(result).toEqual({ invalidPassport: true });
        });
      });
    });
  });
});
