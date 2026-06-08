import { Pipe, PipeTransform } from '@angular/core';

/**
 * Price Pipe
 * Formats number to USD currency
 *
 * Usage: {{ flight.pricePerPassenger | price }}
 * Output: $460.00
 */
@Pipe({
  name: 'price',
  standalone: true
})
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}

/**
 * Duration Pipe
 * Formats minutes to HH:MM format
 *
 * Usage: {{ flight.durationMinutes | duration }}
 * Output: 7h 0m
 */
@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    if (minutes === null || minutes === undefined || minutes <= 0) {
      return '0m';
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    }
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
  }
}

/**
 * Timezone Pipe
 * Converts ISO 8601 UTC time to local timezone
 *
 * Usage: {{ flight.departureTime | timezone }}
 * Output: 7/10/2026, 8:00 AM (or user's local time)
 */
@Pipe({
  name: 'timezone',
  standalone: true
})
export class TimezonePipe implements PipeTransform {
  transform(isoTime: string | null | undefined, format: 'short' | 'long' = 'short'): string {
    if (!isoTime) {
      return 'N/A';
    }

    try {
      const date = new Date(isoTime);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      if (format === 'short') {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }

      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid date';
    }
  }
}

/**
 * Date Only Pipe
 * Converts ISO 8601 UTC time to date only
 *
 * Usage: {{ flight.departureTime | dateOnly }}
 * Output: 7/10/2026
 */
@Pipe({
  name: 'dateOnly',
  standalone: true
})
export class DateOnlyPipe implements PipeTransform {
  transform(isoTime: string | null | undefined): string {
    if (!isoTime) {
      return 'N/A';
    }

    try {
      const date = new Date(isoTime);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  }
}
