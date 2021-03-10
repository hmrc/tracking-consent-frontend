import { Communicator } from '../../types/Communicator';
import { UserPreferences } from '../../types/UserPreferences';

const gtmCommunicatorFactory = (window: Window): Communicator => ({
  sendPreferences: (userPreferences: UserPreferences) => {
    // eslint-disable-next-line no-param-reassign
    window.dataLayer = window.dataLayer || [];
    const preferences = userPreferences.getPreferences() || {};
    const isMeasurementAllowed = preferences.measurement === true;
    const isSettingsAllowed = preferences.settings === true;

    if (isMeasurementAllowed) {
      window.dataLayer.push({ event: 'hmrc-measurement-allowed' });
    }
    window.dataLayer.push({ 'tracking-consent-measurement-allowed': isMeasurementAllowed });
    if (isSettingsAllowed) {
      window.dataLayer.push({ event: 'hmrc-settings-allowed' });
    }
    window.dataLayer.push({ 'tracking-consent-settings-allowed': isSettingsAllowed });
  },
});

export default gtmCommunicatorFactory;
