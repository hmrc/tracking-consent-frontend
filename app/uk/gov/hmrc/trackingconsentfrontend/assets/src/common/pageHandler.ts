import enableGtm from '../interfaces/enableGtm';
import { UserPreferences } from '../../types/UserPreferences';
import isFeatureEnabled from '../interfaces/isFeatureEnabled';
import featureNames from '../constants/featureNames';
import { SERVICE_PAGE_LOAD_EVENT } from '../constants/events';
import getGtmContainerId from './getGtmContainerId';

const pageHandler = (document: HTMLDocument, userPreference: UserPreferences, pageRenderer) => {
  const gtmContainerId = getGtmContainerId();
  if (gtmContainerId === undefined) {
    throw new Error('Unable to enable GTM because container id not specified in data-gtm-container attribute. The previous default container ID was removed on 03 November 2020');
  } else {
    userPreference.sendPreferences(SERVICE_PAGE_LOAD_EVENT);
    enableGtm(gtmContainerId);
    if (isFeatureEnabled(featureNames.enableTrackingConsent)) {
      document.addEventListener('DOMContentLoaded', () => {
        pageRenderer(userPreference);
      });
    }
  }
};

export default pageHandler;
