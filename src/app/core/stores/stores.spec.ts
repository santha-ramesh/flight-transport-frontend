import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FlightSearchStore, BookingStore, AirportStore } from './index';
import { FlightApiService, BookingApiService } from '@core/services/flight-api.service';
import { Flight, SearchQuery, BookingRequest } from '@shared/models';
import { SortOption } from '@shared/enums';
import { of, throwError } from 'rxjs';

describe('FlightSearchStore', () => {
  let store: FlightSearchStore;
  let flightApiService: jasmine.SpyObj<FlightApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('FlightApiService', ['searchFlights']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FlightSearchStore,
        { provide: FlightApiService, useValue: spy }
      ]
    });

    store = TestBed.inject(FlightSearchStore);
    flightApiService = TestBed.inject(FlightApiService) as jasmine.SpyObj<FlightApiService>;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with empty state', () => {
    expect(store.flights$()).toEqual([]);
    expect(store.isLoading$()).toBe(false);
    expect(store.error$()).toBeNull();
  });

  describe('search', () => {
    it('should search for flights successfully', (done) => {
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

      flightApiService.searchFlights.and.returnValue(of(mockFlights));

      store.search(query);

      setTimeout(() => {
        expect(store.flights$().length).toBe(1);
        expect(store.isLoading$()).toBe(false);
        expect(store.error$()).toBeNull();
        done();
      }, 100);
    });

    it('should handle search error', (done) => {
      const query: SearchQuery = {
        origin: 'NY',
        destination: 'LON',
        departureDate: '2026-07-10T00:00:00Z',
        passengers: 2,
        cabinClass: 'Economy'
      };

      flightApiService.searchFlights.and.returnValue(
        throwError(() => new Error('API Error'))
      );

      store.search(query);

      setTimeout(() => {
        expect(store.flights$().length).toBe(0);
        expect(store.isLoading$()).toBe(false);
        expect(store.error$()).not.toBeNull();
        done();
      }, 100);
    });
  });

  it('should sort flights correctly', () => {
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
      },
      {
        provider: 'BudgetWings',
        flightNumber: 'BW202',
        origin: 'NY',
        destination: 'LON',
        departureTime: '2026-07-10T10:00:00Z',
        arrivalTime: '2026-07-10T17:00:00Z',
        durationMinutes: 420,
        cabinClass: 'Economy',
        pricePerPassenger: 350,
        totalPrice: 700
      }
    ];

    // Manually set flights for testing
    (store as any).flights.set(mockFlights);
    store.setSortOption(SortOption.PRICE_ASC);

    const sorted = store.sortedFlights();
    expect(sorted[0].flightNumber).toBe('BW202');
    expect(sorted[1].flightNumber).toBe('GA101');
  });

  it('should reset store state', () => {
    store.reset();

    expect(store.flights$().length).toBe(0);
    expect(store.error$()).toBeNull();
  });
});

describe('BookingStore', () => {
  let store: BookingStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookingStore]
    });

    store = TestBed.inject(BookingStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should initialize with null flight', () => {
    expect(store.selectedFlight$()).toBeNull();
    expect(store.isSubmitting$()).toBe(false);
    expect(store.bookingReference$()).toBeNull();
    expect(store.error$()).toBeNull();
  });

  it('should select flight', () => {
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

    store.selectFlight(mockFlight);

    expect(store.selectedFlight$()).toBe(mockFlight);
  });

  it('should set booking reference', () => {
    store.setBookingReference('SR-AB12CD');

    expect(store.bookingReference$()).toBe('SR-AB12CD');
    expect(store.isBookingConfirmed()).toBe(true);
  });

  it('should set error message', () => {
    store.setError('Booking failed');

    expect(store.error$()).toBe('Booking failed');
  });

  it('should reset store state', () => {
    store.selectFlight({
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
    });
    store.setBookingReference('SR-AB12CD');

    store.reset();

    expect(store.selectedFlight$()).toBeNull();
    expect(store.bookingReference$()).toBeNull();
    expect(store.error$()).toBeNull();
  });
});

describe('AirportStore', () => {
  let store: AirportStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirportStore]
    });

    store = TestBed.inject(AirportStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have 6 airports', () => {
    expect(store.airports$().length).toBe(6);
  });

  it('should get airport by code', () => {
    const airport = store.getAirportByCode('LON');
    expect(airport?.name).toBe('London');
  });
});
