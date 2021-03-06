import enableGtm from '../interfaces/enableGtm';
import { UserPreferences } from '../../types/UserPreferences';
import { SERVICE_PAGE_LOAD_EVENT } from '../constants/events';
import getGtmContainerId from './getGtmContainerId';

const pageHandler = (document: HTMLDocument, userPreferences: UserPreferences, pageRenderer) => {
  const gtmContainerId = getGtmContainerId();
  if (gtmContainerId === undefined) {
    throw new Error('Unable to enable GTM because container id not specified in data-gtm-container attribute. The previous default container ID was removed on 03 November 2020');
  } else {
    userPreferences.sendPreferences(SERVICE_PAGE_LOAD_EVENT);

    enableGtm(gtmContainerId);

    document.addEventListener('DOMContentLoaded', () => {
      pageRenderer(userPreferences);
    });

    window.trackingConsent = { userPreferences };
  }
};

export default pageHandler;
