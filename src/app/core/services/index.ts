import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight, SearchQuery, BookingRequest, BookingResponse } from '@shared/models';

/**
 * Flight API Service
 * Handles all HTTP communication for flight-related operations
 */
@Injectable({ providedIn: 'root' })
export class FlightApiService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Search for flights based on search criteria
   * @param query SearchQuery containing origin, destination, date, etc.
   * @returns Observable<Flight[]> Array of available flights
   */
  searchFlights(query: SearchQuery): Observable<Flight[]> {
    return this.http.post<Flight[]>(`${this.apiUrl}/flights/search`, query);
  }

  /**
   * Get flight details by flight number
   * @param flightNumber Flight number to retrieve
   * @returns Observable<Flight> Flight details
   */
  getFlightDetails(flightNumber: string): Observable<Flight> {
    return this.http.get<Flight>(
      `${this.apiUrl}/flights/${flightNumber}`
    );
  }

  /**
   * Get available cabins for a flight
   * @param flightNumber Flight number
   * @returns Observable<string[]> Available cabin classes
   */
  getAvailableCabins(flightNumber: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/flights/${flightNumber}/cabins`
    );
  }
}

/**
 * Booking API Service
 * Handles all HTTP communication for booking-related operations
 */
@Injectable({ providedIn: 'root' })
export class BookingApiService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Submit a booking request
   * @param bookingRequest Booking details (flight, passenger info, etc.)
   * @returns Observable<BookingResponse> Server response with booking reference
   */
  createBooking(bookingRequest: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(
      `${this.apiUrl}/bookings`,
      bookingRequest
    );
  }

  /**
   * Get booking confirmation by reference
   * @param bookingReference Unique booking reference (e.g., SR-AB12CD)
   * @returns Observable<BookingResponse> Booking confirmation details
   */
  getBookingConfirmation(bookingReference: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(
      `${this.apiUrl}/bookings/${bookingReference}`
    );
  }

  /**
   * Cancel an existing booking
   * @param bookingReference Booking reference to cancel
   * @returns Observable<any> Cancellation response
   */
  cancelBooking(bookingReference: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/bookings/${bookingReference}`
    );
  }
}

/**
 * Airport Service
 * Handles airport data management
 */
@Injectable({ providedIn: 'root' })
export class AirportService {
  // Hardcoded airport data as per spec
  private airports = [
    { code: 'NY', name: 'New York', country: 'USA' },
    { code: 'LA', name: 'Los Angeles', country: 'USA' },
    { code: 'CHI', name: 'Chicago', country: 'USA' },
    { code: 'LON', name: 'London', country: 'UK' },
    { code: 'MAN', name: 'Manchester', country: 'UK' },
    { code: 'EDI', name: 'Edinburgh', country: 'UK' }
  ];

  constructor() {}

  /**
   * Get all available airports
   * @returns Airport array
   */
  getAirports() {
    return [...this.airports];
  }

  /**
   * Get airport by code
   * @param code Airport code
   * @returns Airport object or undefined
   */
  getAirportByCode(code: string) {
    return this.airports.find(a => a.code === code);
  }

  /**
   * Check if flight is domestic or international
   * @param originCode Origin airport code
   * @param destinationCode Destination airport code
   * @returns true if domestic, false if international
   */
  isDomesticFlight(originCode: string, destinationCode: string): boolean {
    const origin = this.getAirportByCode(originCode);
    const destination = this.getAirportByCode(destinationCode);

    if (!origin || !destination) {
      return false;
    }

    return origin.country === destination.country;
  }

  /**
   * Get document type required for flight
   * @param originCode Origin airport code
   * @param destinationCode Destination airport code
   * @returns 'national-id' for domestic, 'passport' for international
   */
  getRequiredDocumentType(originCode: string, destinationCode: string): 'national-id' | 'passport' {
    return this.isDomesticFlight(originCode, destinationCode)
      ? 'national-id'
      : 'passport';
  }
}
