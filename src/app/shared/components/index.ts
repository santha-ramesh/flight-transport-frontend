import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Loading Spinner Component
 * Displays a loading spinner with optional message
 */
@Component({
  selector: 'app-loading-spinner',
  template: `
    <div *ngIf="isLoading" class="spinner-container">
      <div class="spinner"></div>
      <p class="spinner-message">{{ message }}</p>
    </div>
  `,
  styleUrls: ['./loading-spinner.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingSpinnerComponent {
  @Input() isLoading = false;
  @Input() message = 'Loading...';
}

/**
 * Empty State Component
 * Displays a message when no data is available
 */
@Component({
  selector: 'app-empty-state',
  template: `
    <div *ngIf="show" class="empty-state">
      <div class="empty-state-icon">📋</div>
      <p class="empty-state-message">{{ message }}</p>
    </div>
  `,
  styleUrls: ['./empty-state.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EmptyStateComponent {
  @Input() show = false;
  @Input() message = 'No items found.';
}

/**
 * Error Alert Component
 * Displays error messages to the user
 */
@Component({
  selector: 'app-error-alert',
  template: `
    <div *ngIf="message" class="error-alert">
      <div class="error-icon">⚠️</div>
      <div class="error-content">
        <p class="error-message">{{ message }}</p>
        <button 
          *ngIf="dismissible"
          (click)="onDismiss()"
          class="dismiss-button">
          Dismiss
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./error-alert.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ErrorAlertComponent {
  @Input() message: string | null = null;
  @Input() dismissible = true;

  onDismiss(): void {
    this.message = null;
  }
}

/**
 * Success Alert Component
 * Displays success messages to the user
 */
@Component({
  selector: 'app-success-alert',
  template: `
    <div *ngIf="message" class="success-alert">
      <div class="success-icon">✓</div>
      <p class="success-message">{{ message }}</p>
    </div>
  `,
  styleUrls: ['./success-alert.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SuccessAlertComponent {
  @Input() message: string | null = null;
}
