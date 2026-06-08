# SkyRoute Flight Transport - Updated Frontend Architecture (Angular 18)

## 1. Folder Structure

```
src/app/
├── core/
│   ├── services/
│   │   ├── flight-api.service.ts         (API calls for flights)
│   │   ├── booking-api.service.ts        (API calls for bookings)
│   │   └── airport.service.ts            (Airport data management)
│   │
│   ├── stores/                           (Signal-based state management)
│   │   ├── flight-search.store.ts
│   │   ├── booking.store.ts
│   │   └── airport.store.ts
│   │
│   ├── interceptors/
│   │   └── error-handler.interceptor.ts
│   │
│   └── guards/
│       └── can-activate-bookings.guard.ts
│
├── features/
│   │
│   ├── flights/
│   │   ├── components/
│   │   │   ├── search-form/              (Dumb Component - Standalone)
│   │   │   │   ├── search-form.component.ts
│   │   │   │   ├── search-form.component.html
│   │   │   │   └── search-form.component.css
│   │   │   │
│   │   │   ├── flight-card/              (Dumb Component - Standalone, Reusable)
│   │   │   │   ├── flight-card.component.ts
│   │   │   │   ├── flight-card.component.html
│   │   │   │   └── flight-card.component.css
│   │   │   │
│   │   │   ├── search-results/           (Dumb Component - Standalone)
│   │   │   │   ├── search-results.component.ts
│   │   │   │   ├── search-results.component.html
│   │   │   │   └── search-results.component.css
│   │   │   │
│   │   │   └── sorting-controls/         (Dumb Component - Standalone)
│   │   │       ├── sorting-controls.component.ts
│   │   │       ├── sorting-controls.component.html
│   │   │       └── sorting-controls.component.css
│   │   │
│   │   ├── pages/
│   │   │   └── flight-search-page/       (Smart Component - Standalone, Container)
│   │   │       ├── flight-search-page.component.ts
│   │   │       └── flight-search-page.component.html
│   │   │
│   │   └── flights.routes.ts             (Feature lazy-loading routes)
│   │
│   └── bookings/
│       ├── components/
│       │   ├── booking-form/             (Dumb Component - Standalone)
│       │   │   ├── booking-form.component.ts
│       │   │   ├── booking-form.component.html
│       │   │   └── booking-form.component.css
│       │   │
│       │   ├── booking-summary/          (Dumb Component - Standalone)
│       │   │   ├── booking-summary.component.ts
│       │   │   ├── booking-summary.component.html
│       │   │   └── booking-summary.component.css
│       │   │
│       │   └── passenger-form/           (Dumb Component - Standalone)
│       │       ├── passenger-form.component.ts
│       │       ├── passenger-form.component.html
│       │       └── passenger-form.component.css
│       │
│       ├── pages/
│       │   └── booking-page/             (Smart Component - Standalone, Container)
│       │       ├── booking-page.component.ts
│       │       └── booking-page.component.html
│       │
│       └── bookings.routes.ts            (Feature lazy-loading routes)
│
├── shared/
│   ├── models/
│   │   ├── flight.model.ts
│   │   ├── booking.model.ts
│   │   ├── airport.model.ts
│   │   └── search-query.model.ts
│   │
│   ├── enums/
│   │   ├── cabin-class.enum.ts
│   │   ├── sort-option.enum.ts
│   │   └── document-type.enum.ts
│   │
│   ├── validators/
│   │   ├── search-validators.ts
│   │   ├── booking-validators.ts
│   │   └── document-validators.ts
│   │
│   ├── components/
│   │   ├── loading-spinner/              (Reusable UI component)
│   │   ├── empty-state/                  (Reusable UI component)
│   │   └── error-alert/                  (Reusable UI component)
│   │
│   ├── pipes/
│   │   ├── price.pipe.ts                 (Format price to USD)
│   │   ├── duration.pipe.ts              (Format minutes to HH:MM)
│   │   └── timezone.pipe.ts              (Convert UTC to local time)
│   │
│   ├── directives/
│   │   └── highlight-domestic.directive.ts
│   │
│   └── utils/
│       ├── date-time.utils.ts
│       ├── booking-reference.utils.ts
│       └── airport.utils.ts
│
├── app.routes.ts                         (Main routes with lazy loading)
├── app.config.ts                         (App configuration)
└── app.component.ts                      (Root component - Standalone)
```

---

## 2. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLIGHT SEARCH FLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

  User Input
    ↓
    ├─→ [Search Form Component] (Dumb - Standalone)
    │   - Collects: origin, destination, date, passengers, cabin class
    │   - Emits: @Output searchSubmitted(query)
    │
    ├─→ [Flight Search Page Component] (Smart - Container)
    │   - Receives: search query
    │   - Injects: FlightSearchStore
    │   - Actions: Calls store.search(query)
    │
    ├─→ [Flight Search Store] (Signal-based State)
    │   - State: flights$, isLoading$, error$, sortOption$
    │   - Computed: sortedFlights (reactive sorting)
    │   - Action: search() → calls FlightApiService
    │
    ├─→ [Flight API Service]
    │   - HTTP POST to backend: /api/flights/search
    │   - Receives: Flight[] response
    │
    ├─→ [Backend API - .NET 10]
    │   - Process request
    │   - Query all airline providers (GlobalAir, BudgetWings)
    │   - Apply pricing rules
    │   - Return aggregated results
    │
    ├─→ [Search Results Component] (Dumb - Standalone)
    │   - @Input flights: Flight[]
    │   - @Input isLoading: boolean
    │   - @Output flightSelected(flight)
    │   - @Output sortChanged(option)
    │
    ├─→ [Flight Card Component] (Dumb - Highly Reusable)
    │   - @Input flight: Flight
    │   - @Output selected(flight)
    │   - Displays: provider, number, times, price
    │
    └─→ [Loading Spinner] & [Empty State] (Shared Components)


┌─────────────────────────────────────────────────────────────────────────┐
│                         BOOKING FLOW                                    │
└─────────────────────────────────────────────────────────────────────────┘

  User Selects Flight
    ↓
    ├─→ [Booking Page Component] (Smart - Container)
    │   - Receives: Selected flight from route state
    │   - Injects: BookingStore
    │   - Actions: selectFlight(flight)
    │
    ├─→ [Booking Summary Component] (Dumb - Standalone)
    │   - @Input flight: Flight
    │   - Displays: flight details, pricing breakdown
    │
    ├─→ [Passenger Form Component] (Dumb - Standalone)
    │   - Reactive forms: fullName, email, documentNumber
    │   - Dynamic validation: National ID vs Passport (domestic/international)
    │   - @Output bookingSubmitted(bookingRequest)
    │
    ├─→ [Booking Store]
    │   - State: selectedFlight$, isSubmitting$, bookingReference$
    │   - Action: submitBooking(request) → calls BookingApiService
    │
    ├─→ [Booking API Service]
    │   - HTTP POST to backend: /api/bookings
    │   - Receives: { bookingReference: "SR-AB12CD" }
    │
    ├─→ [Backend API - .NET 10]
    │   - Validate booking request
    │   - Generate unique booking reference
    │   - Return reference
    │
    └─→ [Success State]
        - Display booking reference
        - Option to view/print confirmation


┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                                  │
└─────────────────────────────────────────────────────────────────────────┘

app.component (Root - Standalone)
│
├─ flight-search-page (Smart - Container)
│  │
│  ├─ search-form (Dumb - Standalone)
│  │
│  ├─ search-results (Dumb - Standalone)
│  │  │
│  │  ├─ flight-card (Dumb - Reusable)
│  │  ├─ flight-card (Dumb - Reusable)
│  │  └─ flight-card (Dumb - Reusable)
│  │
│  ├─ sorting-controls (Dumb - Standalone)
│  │
│  ├─ loading-spinner (Shared - Standalone)
│  │
│  └─ empty-state (Shared - Standalone)
│
└─ booking-page (Smart - Container)
   │
   ├─ booking-summary (Dumb - Standalone)
   │
   ├─ passenger-form (Dumb - Standalone)
   │
   └─ error-alert (Shared - Standalone)
```

---

## 3. Component Communication Pattern

```
┌──────────────────────────────────────────────────────────────────┐
│                  SMART COMPONENT (Container)                     │
│                                                                  │
│  - Injects Services & Stores                                    │
│  - Handles business logic & state management                    │
│  - Manages component lifecycle                                  │
│  - Routes navigation                                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Injects: FlightSearchStore, BookingStore, Router        │   │
│  │ Signals: flights$, isLoading$, error$, sortOption$      │   │
│  │ Methods: onSearch(), onFlightSelected(), onSortChanged()│   │
│  └─────────────────────────────────────────────────────────┘   │
│           │                          │                          │
│           │                          │                          │
│       @Input/@Output              @Input/@Output                │
│           │                          │                          │
│           ▼                          ▼                          │
├──────────────────────────────────────────────────────────────────┤
│              DUMB COMPONENTS (Presentational)                    │
│                                                                  │
│  search-form               search-results       sorting-controls │
│  ────────────               ──────────────       ─────────────── │
│  @Input:                   @Input:              @Input:          │
│  - airports                - flights[]          - options[]      │
│  - cabinClasses            - isLoading          - currentSort    │
│  - minDate                 - isEmpty            - canSort        │
│                                                                  │
│  @Output:                  @Output:             @Output:         │
│  - searchSubmitted         - flightSelected    - sortChanged     │
│  - formReset               - sortChanged                         │
│                                                                  │
│  - No service injection                                         │
│  - Pure presentation logic                                      │
│  - Easy to test                                                 │
│  - Highly reusable                                              │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. State Management with Signals

```typescript
// core/stores/flight-search.store.ts
@Injectable({ providedIn: 'root' })
export class FlightSearchStore {
  // Writable signals
  private flights = signal<Flight[]>([]);
  private isLoading = signal(false);
  private error = signal<string | null>(null);
  private sortOption = signal('price-asc');

  // Readonly selectors
  flights$ = this.flights.asReadonly();
  isLoading$ = this.isLoading.asReadonly();
  error$ = this.error.asReadonly();

  // Computed signals (derived state)
  sortedFlights = computed(() => this.sortFlights(
    this.flights(),
    this.sortOption()
  ));

  isEmpty = computed(() => 
    this.flights().length === 0 && !this.isLoading()
  );

  // Actions
  search(query: SearchQuery) {
    this.isLoading.set(true);
    this.flightApi.search(query).subscribe({
      next: (flights) => {
        this.flights.set(flights);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Unable to retrieve flights');
        this.isLoading.set(false);
      }
    });
  }

  setSortOption(option: string) {
    this.sortOption.set(option);
  }
}
```

---

## 5. Smart Component Example

```typescript
// features/flights/pages/flight-search-page.component.ts
@Component({
  selector: 'app-flight-search-page',
  template: `
    <div class="search-page">
      <app-search-form 
        [airports]="airports()"
        (searchSubmitted)="onSearch($event)">
      </app-search-form>

      <app-loading-spinner 
        [isLoading]="isLoading()">
      </app-loading-spinner>

      <app-search-results 
        *ngIf="!isEmpty()"
        [flights]="sortedFlights()"
        [sortOption]="sortOption()"
        (flightSelected)="onFlightSelected($event)"
        (sortChanged)="onSortChanged($event)">
      </app-search-results>

      <app-empty-state 
        [show]="isEmpty()"
        message="No flights found.">
      </app-empty-state>

      <app-error-alert 
        *ngIf="error()"
        [message]="error()">
      </app-error-alert>
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    SearchFormComponent,
    SearchResultsComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorAlertComponent
  ]
})
export class FlightSearchPageComponent {
  private store = inject(FlightSearchStore);
  private router = inject(Router);

  // Expose store signals
  flights = this.store.flights$;
  isLoading = this.store.isLoading$;
  error = this.store.error$;
  sortedFlights = this.store.sortedFlights;
  isEmpty = this.store.isEmpty;
  sortOption = this.store.sortOption;

  onSearch(query: SearchQuery) {
    this.store.search(query);
  }

  onFlightSelected(flight: Flight) {
    this.router.navigate(['/bookings'], {
      state: { selectedFlight: flight }
    });
  }

  onSortChanged(option: string) {
    this.store.setSortOption(option);
  }
}
```

---

## 6. Dumb Component Example

```typescript
// features/flights/components/flight-card/flight-card.component.ts
@Component({
  selector: 'app-flight-card',
  template: `
    <div class="flight-card" (click)="selectFlight()">
      <div class="provider">{{ flight.provider }}</div>
      <div class="flight-number">{{ flight.flightNumber }}</div>
      
      <div class="route">
        {{ flight.origin }} → {{ flight.destination }}
      </div>

      <div class="times">
        <span>{{ flight.departureTime | timezone }}</span>
        <span>{{ flight.durationMinutes | duration }}</span>
        <span>{{ flight.arrivalTime | timezone }}</span>
      </div>

      <div class="pricing">
        <div class="per-passenger">
          {{ flight.pricePerPassenger | price }} per passenger
        </div>
        <div class="total">
          Total: {{ flight.totalPrice | price }}
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, PricePipe, DurationPipe, TimezonePipe]
})
export class FlightCardComponent {
  @Input() flight!: Flight;
  @Output() selected = new EventEmitter<Flight>();

  selectFlight() {
    this.selected.emit(this.flight);
  }
}
```

---

## 7. Lazy Loading Routes

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/flights',
    pathMatch: 'full'
  },
  {
    path: 'flights',
    loadComponent: () => 
      import('./features/flights/pages/flight-search-page.component')
        .then(m => m.FlightSearchPageComponent)
  },
  {
    path: 'bookings',
    loadComponent: () => 
      import('./features/bookings/pages/booking-page.component')
        .then(m => m.BookingPageComponent)
  }
];
```

---

## 8. Key Architectural Improvements

| Aspect | Original | Updated |
|--------|----------|---------|
| **Standalone** | Not specified | ✅ All components `standalone: true` |
| **Smart/Dumb** | Not separated | ✅ Clear container/presentational separation |
| **State Mgmt** | Not specified | ✅ Signal-based reactive stores |
| **Reusability** | Potential coupling | ✅ Dumb components with explicit dependencies |
| **Lazy Loading** | Not mentioned | ✅ Feature-level code splitting |
| **Shared UI** | Mixed | ✅ Dedicated shared components |
| **Type Safety** | Generic | ✅ Strong model interfaces |
| **Scalability** | Limited | ✅ Provider pattern + extensible stores |
| **Testing** | Difficult | ✅ Easy to unit test dumb components |

---

## 9. Implementation Checklist

- [ ] Create folder structure with core, features, shared
- [ ] Convert all components to standalone
- [ ] Implement Signal-based stores (FlightSearchStore, BookingStore)
- [ ] Create smart components (FlightSearchPage, BookingPage)
- [ ] Create dumb components with @Input/@Output
- [ ] Add shared reusable components (Spinner, EmptyState, ErrorAlert)
- [ ] Create pipes for formatting (Price, Duration, Timezone)
- [ ] Set up lazy loading routes
- [ ] Implement HTTP interceptors for error handling
- [ ] Add validators for forms
- [ ] Create TypeScript models/interfaces
- [ ] Add unit tests

---

## 10. Benefits of This Architecture

✅ **Modularity** - Features are independent and can be developed in parallel
✅ **Testability** - Dumb components are easy to test with mocks
✅ **Reusability** - Components can be reused across features
✅ **Scalability** - New providers/features added without refactoring
✅ **Performance** - Lazy loading reduces initial bundle size
✅ **Maintainability** - Clear separation of concerns
✅ **Reactivity** - Signals provide real-time state updates
✅ **Type Safety** - Full TypeScript coverage with interfaces
