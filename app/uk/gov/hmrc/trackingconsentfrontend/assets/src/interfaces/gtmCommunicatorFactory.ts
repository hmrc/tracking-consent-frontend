import { Communicator } from '../../types/Communicator';
import { UserPreferences } from '../../types/UserPreferences';

const gtmCommunicatorFactory = (window: Window): Communicator => ({
  sendPreferences: (userPreferences: UserPreferences) => {
    // eslint-disable-next-line no-param-reassign
    window.dataLayer = window.dataLayer || [];
    const preferences = userPreferences.getPreferences() || {};
    if (preferences.measurement === true) {
      window.dataLayer.push({ event: 'hmrc-measurement-allowed' });
    }
    if (preferences.marketing === true) {
      window.dataLayer.push({ event: 'hmrc-marketing-allowed' });
    }
    if (preferences.settings === true) {
      window.dataLayer.push({ event: 'hmrc-settings-allowed' });
    }
  },
});

export default gtmCommunicatorFactory;
