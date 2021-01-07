import Cookies from 'js-cookie';
import cookieTypes from '../constants/cookieTypes';
import fromEntries from '../common/fromEntries';
import { COOKIE_CONSENT, COOKIE_VERSION } from '../constants/cookies';
import { UserPreferences } from '../../types/UserPreferences';
import { Communicator } from '../../types/Communicator';
import { Preferences } from '../../types/Preferences';
import { Cookie } from '../../types/Cookie';
import { CONSENT_UPDATED_EVENT } from '../constants/events';

const userPreferencesFactory = (): UserPreferences => {
  let self;
  const subscribers: Communicator[] = [];

  const subscribe = (preferenceCommunicator: Communicator) => {
    subscribers.push(preferenceCommunicator);
  };

  const sendPreferences = (event: string) => {
    subscribers.forEach((subscriber: Communicator) => subscriber.sendPreferences(self, event));
  };

  const storePreferences = (preferences: Preferences) => {
    Cookies.set(
      COOKIE_CONSENT,
      {
        version: '2020.1',
        datetimeSet: new Date().toISOString(),
        preferences,
      },
      { sameSite: 'strict', expires: 3650 },
    );
  };

  const userAcceptsAll = () => {
    storePreferences({
      acceptAll: true,
    });
    sendPreferences(CONSENT_UPDATED_EVENT);
  };

  const setPreferences = (preferencesIn: Preferences) => {
    storePreferences({
      measurement: preferencesIn.measurement,
      marketing: preferencesIn.marketing,
      settings: preferencesIn.settings,
    });
    sendPreferences(CONSENT_UPDATED_EVENT);
  };

  const getSanitisedPreferences = (preferences: any): Preferences => fromEntries(cookieTypes.map(
    (cookieType: string) => {
      const { [cookieType]: value } = preferences;

      return [cookieType, value === true];
    },
  ));

  const allThePreferences = (hasConsented: boolean) => fromEntries(cookieTypes.map(
    (cookieType: string) => [cookieType, hasConsented],
  ));

  const validateCookie = (): Cookie | undefined => {
    const cookie = Cookies.getJSON(COOKIE_CONSENT);
    if (cookie === null || cookie === undefined || cookie.preferences === undefined) {
      return undefined;
    }

    const { version } = cookie;
    if (version !== COOKIE_VERSION) {
      return undefined;
    }

    return cookie;
  };

  const getPreferences = (): Preferences | undefined => {
    const cookie = validateCookie();
    if (cookie === undefined) {
      return allThePreferences(false);
    }

    const { preferences } = cookie;
    if (preferences.acceptAll === true) {
      return allThePreferences(true);
    }

    return getSanitisedPreferences(preferences);
  };

  const getUserHasSavedCookiePreferences = () => validateCookie() !== undefined;

  self = {
    userAcceptsAll,
    setPreferences,
    getUserHasSavedCookiePreferences,
    getPreferences,
    sendPreferences,
    subscribe,
  };

  return self;
};

export default userPreferencesFactory;
