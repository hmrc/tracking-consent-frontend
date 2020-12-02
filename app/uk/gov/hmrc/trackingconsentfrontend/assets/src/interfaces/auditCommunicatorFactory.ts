import { Communicator } from '../../types/Communicator';
import { UserPreferences } from '../../types/UserPreferences';
import post from '../common/post';
import getTrackingConsentBaseUrl from '../common/getTrackingConsentBaseUrl';
import { CONSENT_UPDATED_EVENT } from '../constants/events';

const auditCommunicatorFactory = (): Communicator => ({
  sendPreferences: (userPreferences: UserPreferences, event: string) => {
    if (event === CONSENT_UPDATED_EVENT) {
      const preferences = userPreferences.getPreferences();
      if (preferences !== undefined) {
        post(`${getTrackingConsentBaseUrl()}/tracking-consent/audit`, preferences);
      }
    }
  },
});

export default auditCommunicatorFactory;
