import type { UserPreferences } from './UserPreferences';

export {};

declare global {
  interface Window {
    optimizely: any[];
    dataLayer: any[];
    trackingConsent: { userPreferences: UserPreferences };
  }
}
