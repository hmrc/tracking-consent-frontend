import { Communicator } from '../../types/Communicator';
import { UserPreferences } from '../../types/UserPreferences';

const gtmCommunicatorFactory = (window: Window): Communicator => ({
  sendPreferences: (userPreferences: UserPreferences) => {
    window.dataLayer = window.dataLayer || [];
    const preferences = userPreferences.getPreferences() || {};
    const isMeasurementAllowed = preferences.measurement === true;
    const isSettingsAllowed = preferences.settings === true;

    if (isMeasurementAllowed) {
      window.dataLayer.push({ event: 'trackingConsentMeasurementAccepted' });
    }

    if (isSettingsAllowed) {
      window.dataLayer.push({ event: 'trackingConsentSettingsAccepted' });
    }

    window.dataLayer.push({
      trackingConsentMeasurementAccepted: isMeasurementAllowed,
      trackingConsentSettingsAccepted: isSettingsAllowed,
    });
  },
});

export default gtmCommunicatorFactory;
