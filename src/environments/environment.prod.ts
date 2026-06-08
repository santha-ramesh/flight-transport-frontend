/**
 * Production Environment Configuration
 * Used when running: ng build --configuration=production
 */
export const environment = {
  production: true,
  apiUrl: 'https://api.skyroute.com/api',
  apiTimeout: 30000,
  enableLogging: false,
  mockData: false
};
