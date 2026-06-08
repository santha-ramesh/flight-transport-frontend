/**
 * Flight Model
 * Represents flight data from the API
 */
export interface Flight {
  provider: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;  // ISO 8601 UTC format
  arrivalTime: string;    // ISO 8601 UTC format
  durationMinutes: number;
  cabinClass: string;
  pricePerPassenger: number;
  totalPrice: number;
}

/**
 * Extended Flight Model for internal use
 */
export interface FlightWithDetails extends Flight {
  isDomestic: boolean;
  isSelected?: boolean;
  bookingId?: string;
}
