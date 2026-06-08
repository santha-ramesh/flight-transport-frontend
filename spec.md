# SkyRoute Travel Platform

## Flight Search & Booking Module

# 1. Purpose

This document defines the functional requirements, technical design, architecture decisions, assumptions, API contracts, validation rules, and implementation approach for the SkyRoute Flight Search & Booking module.


# 2. Scope

The module provides:

1. Flight Search
2. Flight Result Display & Sorting
3. Flight Booking Flow
4. Airline Provider Integration Layer
5. Booking API

Out of Scope:

* Payment processing
* Real airline integrations
* Seat selection
* Ticket issuance
* Booking cancellation
* Flight status tracking

---

# 3. Technology Stack

## Frontend

* Angular 18
* TypeScript
* Angular Reactive Forms
* Angular Router
* RxJS

## Backend

* .NET 10 Web API
* ASP.NET Core
* Dependency Injection
* Swagger
* MSTest (for unit tests)

---

# 4. Architecture Overview

## Frontend Architecture
src/
└── app/
    │
    ├── core/
    │   ├── services/
    │   │   ├── flight-api.service.ts
    │   │   └── booking-api.service.ts
    │   │
    │   └── interceptors/
    │
    ├── features/
    │   │
    │   ├── flights/
    │   │   ├── search-form/
    │   │   ├── search-results/
    │   │   └── flight-search-page/
    │   │
    │   └── bookings/
    │       ├── booking-form/
    │       ├── booking-summary/
    │       └── booking-page/
    │
    ├── shared/
    │   ├── models/
    │   ├── enums/
    │   ├── validators/
    │   └── components/
    │
    ├── app.routes.ts
    └── app.config.ts


Responsibilities:

Search Feature

* Search form
* Result display
* Client-side sorting

Booking Feature

* Booking summary
* Passenger form
* Booking submission

API Service

* HTTP communication

---

## Backend Architecture

SkyRoute.Api/
│
├── Flights/
│   │
│   ├── Controllers/
│   │   └── FlightController.cs
│   │
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   └── IFlightSearchService.cs
│   │   │
│   │   └── FlightSearchService.cs
│   │
│   ├── Models/
│   │   └── Flight.cs
│   │
│   ├── Contracts/
│   │   ├── SearchRequest.cs
│   │   └── SearchResponse.cs
│   │
│   └── Validators/
│       └── SearchRequestValidator.cs
│
├── Bookings/
│   │
│   ├── Controllers/
│   │   └── BookingController.cs
│   │
│   ├── Services/
│   │   ├── Interfaces/
│   │   │   └── IBookingService.cs
│   │   │
│   │   └── BookingService.cs
│   │
│   ├── Contracts/
│   │   ├── BookingRequest.cs
│   │   └── BookingResponse.cs
│   │
│   ├── Models/
│   │   └── Booking.cs
│   │
│   └── Validators/
│       └── BookingRequestValidator.cs
│
├── Providers/
│   │
│   ├── Interfaces/
│   │   └── IAirlineProvider.cs
│   │
│   ├── Implementations/
│   │   ├── GlobalAirProvider.cs
│   │   └── BudgetWingsProvider.cs
│   │
│   └── Models/
│       └── ProviderFlightResult.cs
│
├── Pricing/
│   │
│   ├── Interfaces/
│   │   └── IPricingService.cs
│   │
│   ├── PricingService.cs
│   │
│   └── PricingRules/
│       ├── GlobalAirPricingRule.cs
│       └── BudgetWingsPricingRule.cs
│
├── Shared/
│   │
│   ├── Constants/
│   │   ├── AirportCatalog.cs
│   │   ├── CabinClasses.cs
│   │   └── ProviderNames.cs
│   │
│   ├── Models/
│   │   ├── Airport.cs
│   │   └── ApiErrorResponse.cs
│   │
│   ├── Helpers/
│   │   ├── BookingReferenceGenerator.cs
│   │
│   └── Extensions/
│       └── ServiceCollectionExtensions.cs
│
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
│
├── Program.cs
│
└── appsettings.json

This design supports onboarding additional airline providers without modifying existing search logic.

---

# 5. Airline Provider Design

## Requirement

Additional providers will be added in future.

### Recommended Architecture: Strategy Pattern
Purpose
- Encapsulate airline provider behavior
- Support future provider onboarding
- Keep flight search logic independent of provider implementations

Implementation
- IAirlineProvider
- GlobalAirProvider
- BudgetWingsProvider
- FlightSearchService aggregates results from all registered providers


No modification to existing providers or services.

---

# 6. Airport Data

Hardcoded dataset.

Minimum 6 airports.

| Airport     | Code | Country |
| ----------- | ---- | ------- |
| New York    | NY   | USA     |
| Los Angeles | LA  | USA     |
| Chicago     | CHI  | USA     |
| London      | LON  | UK      |
| Manchester  | MAN  | UK      |
| Edinburgh   | EDI  | UK      |

Country information is required for domestic/international validation logic.

---

# 7. Flight Search Requirements

## Inputs

Origin Airport

Required

Destination Airport

Required

Must differ from origin

Departure Date

Required

Cannot be in the past

Passengers

Required

Range: 1–9

Cabin Class

Required

Values:

* Economy
* Business
* First Class

---

## Search Flow

1. User submits search.
2. Frontend calls backend API.
3. Backend queries all providers.
4. Provider prices are calculated.
5. Aggregated results returned.
6. Results displayed.

---

# 8. Flight Result Model
[
{
  "provider": "GlobalAir",
  "flightNumber": "GA101",
  "origin": "NY",
  "destination": "LAN",
  "departureTime": "2026-07-10T08:00:00Z",
  "arrivalTime": "2026-07-10T15:00:00Z",
  "durationMinutes": 420,
  "cabinClass": "Economy",
  "pricePerPassenger": 460.00,
  "totalPrice": 920.00
}
]

---

# 9. Pricing Rules

## GlobalAir

Formula:

Final Price = Base Fare + (Base Fare × 15%)

Requirements:

* Apply surcharge before multiplying by passenger count
* Round to 2 decimal places

Example:

Base Fare = 100

Final = 115.00

2 Passengers

Total = 230.00

---

## BudgetWings

Formula:

Final Price = Base Fare - (Base Fare × 10%)

Constraint:

Minimum Final Price = 29.99

Example:

Base Fare = 100

Final = 90.00

Example:

Base Fare = 20

Discounted = 18

Final = 29.99

---

## Total Pricing

Total Price = Price Per Passenger × Passenger Count

UI must display:

USD 920.00 total

USD 460.00 per passenger

---

# 10. Search Result Sorting

Sorting occurs entirely on frontend.

No additional API calls.

Supported:

## Price

Ascending

Descending

## Duration

Shortest First

## Departure Time

Earliest First

Implementation:

Angular computed sorting using RxJS stream or array sorting.

---

# 11. Loading State

Displayed while search request is active.

Examples:

* Spinner
* Skeleton Loader

Requirement:

User receives visual feedback before results arrive.

---

# 12. Empty State

Displayed when:

Search returns zero flights.

Message:

"No flights found matching your search criteria."

---

# 13. Booking Flow

## Trigger

User selects a flight.

## Booking Screen

Displays:

Flight Summary

* Origin
* Destination
* Provider
* Flight Number
* Departure Time
* Arrival Time
* Cabin Class

Price Breakdown

* Per Passenger Price
* Passenger Count
* Total Price

Passenger Details Form

* Full Name
* Email
* Document Number

Confirm Booking Button

---

# 14. Domestic vs International Logic

Definition:

Domestic:

Origin.Country == Destination.Country

International:

Origin.Country != Destination.Country

---

## Domestic Flight

Field Label: National ID

Validation: Regex: ^[A-Za-z0-9]{6,20}$

---

## International Flight

Field Label: Passport Number

Validation: Regex: ^[A-Z0-9]{6,12}$

---

Frontend behavior:

Label changes dynamically.

Validation changes dynamically.

No page refresh required.

---

# 15. Booking Request Contract

```json
{
  "flightNumber": "GA101",
  "provider": "GlobalAir",
  "passengerCount": 2,
  "fullName": "John Smith",
  "email": "john@example.com",
  "documentNumber": "P1234567"
}
```

---

# 16. Booking Response Contract

```json
{
  "bookingReference": "SR-AB12CD"
}
```

Reference generated server-side.

Uniqueness required.

Format: SR-{6 random alphanumeric characters}

---

# 17. Backend API Specification

## Search Flights

POST

/api/flights/search

Request:

```json
{
  "origin": "JFK",
  "destination": "LHR",
  "departureDate": "2026-07-10T00:00:00Z",
  "passengers": 2,
  "cabinClass": "Economy"
}
```

Response:

```json
[
  {
    "provider": "GlobalAir",
    "flightNumber": "GA101",
    "origin": "JFK",
    "destination": "LHR",
    "departureTime": "2026-07-10T08:00:00Z",
    "arrivalTime": "2026-07-10T15:00:00Z",
    "durationMinutes": 420,
    "cabinClass": "Economy",
    "pricePerPassenger": 460.00,
    "totalPrice": 920.00
  }
]
```

---

## Confirm Booking

POST

/api/bookings

Request:

BookingRequest

Response:

BookingResponse

---

# 18. Mock Provider Behaviour

Providers are mocked.

Each provider must:

1. Return realistic flights
2. Respect route searched
3. Return varied prices
4. Return varied durations
5. Return at least 3–5 results

Implementation may use deterministic random generation.

No external APIs required.

---

# 19. Validation Rules

## Frontend

Origin Required

Destination Required

Different Airports

Departure Date Required

Future Date

Passengers 1–9

Cabin Class Required

Valid Email

Document Number Validation

---

## Backend

All frontend validations duplicated.

Backend remains source of truth.

Invalid requests return:HTTP 400

Validation details payload.

---

# 20. Error Handling

API Errors

Display user-friendly message.

Examples:

Search Failure:

"Unable to retrieve flights. Please try again."

Booking Failure:

"Booking could not be completed."

No unhandled exceptions exposed.

---

## 21. Authentication

Search endpoint: Public (no auth required)
Booking endpoint: Public (no auth required)

# 22. Non-Functional Requirements
Maintainability

Provider abstraction required.

Extensibility

New providers added without modifying search orchestration.

Readability

Clean architecture and naming conventions.

Testability

Business logic separated from controllers.

---

# 22. Date & Time Handling

All date and time values use **ISO 8601 UTC format**: `YYYY-MM-DDTHH:mm:ssZ`

**Request Format:**
- Departure Date: `2026-07-10T00:00:00Z`
- Time component always `00:00:00Z` for date-only inputs

**Response Format:**
- Departure Time: `2026-07-10T08:00:00Z`
- Arrival Time: `2026-07-10T15:00:00Z`
- All times in UTC (Z suffix)

**Backend Processing:**
- Parse incoming dates as UTC
- Compare departure date against current UTC time (cannot be in past)
- All internal calculations in UTC
- Return all times in UTC format

**Frontend Processing:**
- Accept user input in local timezone
- Convert to UTC before API call
- Convert response times to user's local timezone for display (optional: show UTC badge)

---

# 23. Assumptions

1. Single passenger information represents booking owner.
2. Passenger count applies to identical pricing.
3. Currency is USD.
4. Flight inventory is always available.
5. Booking always succeeds if validation passes.
6. No persistence database required.
7. Mock providers generate in-memory data.
8. All times handled in UTC internally; frontend responsible for timezone display.

# 24. Acceptance Criteria

The implementation is complete when:

* Flight search returns aggregated provider results from all concurrent providers.
* strategy pattern and service layer is implemented for future extension of providers.
* Provider pricing rules are correctly applied.
* Total and per-passenger pricing are visible.
* Sorting occurs client-side only.
* Loading and empty states are implemented.
* Booking flow completes successfully.
* Domestic/International document rules function correctly.
* Booking reference is generated.
* All dates/times use UTC format consistently.
* Application runs locally via Angular + .NET.
* Swagger documentation is available.
* Code follows architecture described in this specification.
