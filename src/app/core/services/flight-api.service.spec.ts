import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FlightApiService, BookingApiService, AirportService } from './flight-api.service';
import { Flight, SearchQuery, BookingRequest, BookingResponse } from '@shared/models';

describe('FlightApiService', () => {
  let service: FlightApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FlightApiService]
    });
    service = TestBed.inject(FlightApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchFlights', () => {
    it('should make POST request to /flights/search', () => {
      const query: SearchQuery = {
        origin: 'NY',
        destination: 'LON',
        departureDate: '2026-07-10T00:00:00Z',
        passengers: 2,
        cabinClass: 'Economy'
      };

      const mockFlights: Flight[] = [
        {
          provider: 'GlobalAir',
          flightNumber: 'GA101',
          origin: 'NY',
          destination: 'LON',
          departureTime: '2026-07-10T08:00:00Z',
          arrivalTime: '2026-07-10T15:00:00Z',
          durationMinutes: 420,
          cabinClass: 'Economy',
          pricePerPassenger: 460,
          totalPrice: 920
        }
      ];

      service.searchFlights(query).subscribe(flights => {
        expect(flights.length).toBe(1);
        expect(flights[0].flightNumber).toBe('GA101');
      });

      const req = httpMock.expectOne(req => req.url.includes('/flights/search'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(query);
      req.flush(mockFlights);
    });
  });

  describe('getFlightDetails', () => {
    it('should make GET request to /flights/{flightNumber}', () => {
      const flightNumber = 'GA101';
      const mockFlight: Flight = {
        provider: 'GlobalAir',
        flightNumber: 'GA101',
        origin: 'NY',
        destination: 'LON',
        departureTime: '2026-07-10T08:00:00Z',
        arrivalTime: '2026-07-10T15:00:00Z',
        durationMinutes: 420,
        cabinClass: 'Economy',
        pricePerPassenger: 460,
        totalPrice: 920
      };

      service.getFlightDetails(flightNumber).subscribe(flight => {
        expect(flight.flightNumber).toBe('GA101');
      });

      const req = httpMock.expectOne(req => req.url.includes(`/flights/${flightNumber}`));
      expect(req.request.method).toBe('GET');
      req.flush(mockFlight);
    });
  });
});

describe('BookingApiService', () => {
  let service: BookingApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookingApiService]
    });
    service = TestBed.inject(BookingApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createBooking', () => {
    it('should make POST request to /bookings', () => {
      const bookingRequest: BookingRequest = {
        flightNumber: 'GA101',
        provider: 'GlobalAir',
        passengerCount: 2,
        fullName: 'John Smith',
        email: 'john@example.com',
        documentNumber: 'P1234567'
      };

      const mockResponse: BookingResponse = {
        bookingReference: 'SR-AB12CD'
      };

      service.createBooking(bookingRequest).subscribe(response => {
        expect(response.bookingReference).toBe('SR-AB12CD');
      });

      const req = httpMock.expectOne(req => req.url.includes('/bookings'));
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(bookingRequest);
      req.flush(mockResponse);
    });
  });

  describe('getBookingConfirmation', () => {
    it('should make GET request to /bookings/{reference}', () => {
      const reference = 'SR-AB12CD';
      const mockResponse: BookingResponse = {
        bookingReference: 'SR-AB12CD'
      };

      service.getBookingConfirmation(reference).subscribe(response => {
        expect(response.bookingReference).toBe('SR-AB12CD');
      });

      const req = httpMock.expectOne(req => req.url.includes(`/bookings/${reference}`));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});

describe('AirportService', () => {
  let service: AirportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirportService]
    });
    service = TestBed.inject(AirportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all airports', () => {
    const airports = service.getAirports();
    expect(airports.length).toBe(6);
    expect(airports[0].code).toBe('NY');
  });

  it('should get airport by code', () => {
    const airport = service.getAirportByCode('LON');
    expect(airport).toBeTruthy();
    expect(airport?.name).toBe('London');
    expect(airport?.country).toBe('UK');
  });

  it('should identify domestic flight', () => {
    const isDomestic = service.isDomesticFlight('NY', 'LA');
    expect(isDomestic).toBe(true);
  });

  it('should identify international flight', () => {
    const isDomestic = service.isDomesticFlight('NY', 'LON');
    expect(isDomestic).toBe(false);
  });

  it('should return National ID for domestic flight', () => {
    const docType = service.getRequiredDocumentType('NY', 'LA');
    expect(docType).toBe('national-id');
  });

  it('should return Passport for international flight', () => {
    const docType = service.getRequiredDocumentType('NY', 'LON');
    expect(docType).toBe('passport');
  });
});
