/**
 * Search Query Model
 * Represents flight search parameters
 */
export interface SearchQuery {
  origin: string;
  destination: string;
  departureDate: string;  // ISO 8601 UTC format
  passengers: number;
  cabinClass: string;
}

/**
 * Airport Model
 * Represents an airport with location details
 */
export interface Airport {
  code: string;
  name: string;
  country: string;
}

/**
 * Booking Request Model
 * Passenger information for booking submission
 */
export interface BookingRequest {
  flightNumber: string;
  provider: string;
  passengerCount: number;
  fullName: string;
  email: string;
  documentNumber: string;
}

/**
 * Booking Response Model
 * Server response after booking confirmation
 */
export interface BookingResponse {
  bookingReference: string;
}

/**
 * Booking Status Model
 * Current status of a booking
 */
export interface BookingStatus {
  bookingReference: string;
  status: 'pending' | 'confirmed' | 'failed';
  message?: string;
  createdAt?: string;
}
