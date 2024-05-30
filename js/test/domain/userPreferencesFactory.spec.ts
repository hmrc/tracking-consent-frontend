/* global spyOn */
import Cookies from 'js-cookie';
import userPreferencesFactory from '../../src/domain/userPreferencesFactory';
import gtmCommunicatorFactory from '../../src/interfaces/gtmCommunicatorFactory';
import { CONSENT_UPDATED_EVENT, SERVICE_PAGE_LOAD_EVENT } from '../../src/constants/events';

describe('userPreferencesFactory', () => {
  const assume = expect;
  let testScope;

  beforeEach(() => {
    testScope = { fakeDatetime: 1591234567890, cookieData: {}, window: {} };
    testScope.preferenceCommunicator = gtmCommunicatorFactory(testScope.window);
    spyOn(testScope.preferenceCommunicator, 'sendPreferences');
    testScope.userPreference = userPreferencesFactory();
    testScope.userPreference.subscribe(testScope.preferenceCommunicator);
    spyOn(Cookies, 'set').and.callFake((cookieName, value) => {
      testScope.cookieData[cookieName] = value;
    });
    spyOn(Cookies, 'get').and.callFake((cookieName) => testScope.cookieData[cookieName]);
    spyOn(Date.prototype, 'toISOString').and.callFake(() => testScope.fakeDatetime);
  });

  const setConsentCookie = (obj) => {
    testScope.cookieData.userConsent = { version: '2021.1', ...obj };
  };

  const expectTrackingPreferenceToHaveBeenSetWith = (preference) => {
    expect(Cookies.set).toHaveBeenCalledWith('userConsent', preference, expect.anything());
    expect(Cookies.set).toHaveBeenCalledTimes(1);
  };

  const doNotConsentToAny = {
    measurement: false,
    settings: false,
  };

  const consentToAll = {
    measurement: true,
    settings: true,
  };

  const rejectAdditional = {
    measurement: false,
    settings: false,
  };

  describe('getTrackingPreferencesSaved', () => {
    it('should determine if tracking preferences have been set', () => {
      setConsentCookie({
        preferences: {
          measurement: true,
          settings: true,
        },
      });

      expect(testScope.userPreference.getUserHasSavedCookiePreferences()).toEqual(true);
    });

    it('should determine if tracking preferences have been set', () => {
      delete testScope.userConsent;

      expect(testScope.userPreference.getUserHasSavedCookiePreferences()).toEqual(false);
    });
  });

  describe('Accept All', () => {
    it('should set the cookie body with the JSON format', () => {
      testScope.userPreference.userAcceptsAdditional();
      expectTrackingPreferenceToHaveBeenSetWith({
        version: '2021.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          measurement: true,
          settings: true,
        },
      });
    });

    it('should set the cookie body with the correct dateTime', () => {
      testScope.fakeDatetime = 987654321;
      testScope.userPreference.userAcceptsAdditional();
      expectTrackingPreferenceToHaveBeenSetWith({
        version: '2021.1',
        datetimeSet: 987654321,
        preferences: {
          measurement: true,
          settings: true,
        },
      });
    });

    it('should set cookie security appropriately', () => {
      expect(Cookies.set).not.toHaveBeenCalledWith();
      testScope.userPreference.userAcceptsAdditional();
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', expect.anything(), { sameSite: 'strict', expires: 365 });
    });

    it('should call preference communicator', () => {
      assume(testScope.preferenceCommunicator.sendPreferences).not.toHaveBeenCalled();

      testScope.userPreference.userAcceptsAdditional();
      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake((userPreference) => {
        expect(userPreference.getPreferences()).toEqual(consentToAll);
      });

      testScope.userPreference.userAcceptsAdditional();
      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });
  });

  describe('Reject All', () => {
    it('should set the cookie body with the JSON format', () => {
      testScope.userPreference.userRejectsAdditional();
      expectTrackingPreferenceToHaveBeenSetWith({
        version: '2021.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          measurement: false,
          settings: false,
        },
      });
    });

    it('should call preference communicator', () => {
      assume(testScope.preferenceCommunicator.sendPreferences).not.toHaveBeenCalled();

      testScope.userPreference.userRejectsAdditional();
      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake((userPreference) => {
        expect(userPreference.getPreferences()).toEqual(rejectAdditional);
      });

      testScope.userPreference.userRejectsAdditional();
      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });
  });

  describe('getPreferences', () => {
    it('should return do not for all settings when no preferences set', () => {
      setConsentCookie(undefined);

      expect(testScope.userPreference.getPreferences()).toEqual(doNotConsentToAny);
    });

    it('should return do not for all settings when cookie value is not an object', () => {
      setConsentCookie('abc');

      expect(testScope.userPreference.getPreferences()).toEqual(doNotConsentToAny);
    });

    it('should return do not for all settings when cookie value is the wrong shape', () => {
      setConsentCookie({ abc: 'abc' });

      expect(testScope.userPreference.getPreferences()).toEqual(doNotConsentToAny);
    });

    it('should interpret boolean false correctly', () => {
      setConsentCookie({ preferences: { measurement: true, settings: false } });

      expect(testScope.userPreference.getPreferences()).toEqual({
        measurement: true,
        settings: false,
      });
    });

    it('should ignore any non-boolean data', () => {
      setConsentCookie({ preferences: { measurement: true, settings: 'abc' } });

      expect(testScope.userPreference.getPreferences()).toEqual({
        measurement: true,
        settings: false,
      });
    });

    it('should ignore any null values', () => {
      setConsentCookie({ preferences: { measurement: true, settings: null } });

      expect(testScope.userPreference.getPreferences()).toEqual({
        measurement: true,
        settings: false,
      });
    });

    it('should ignore any undefined values', () => {
      setConsentCookie({ preferences: { measurement: true, settings: undefined } });

      expect(testScope.userPreference.getPreferences()).toEqual({
        measurement: true,
        settings: false,
      });
    });

    it('should return do not consent to any if measurement is non-boolean but truthy', () => {
      setConsentCookie({
        preferences: {
          measurement: 'abc',
        },
      });

      expect(testScope.userPreference.getPreferences()).toEqual(doNotConsentToAny);
    });

    it('should return do not consent to any if there are no valid preferences', () => {
      setConsentCookie({
        preferences: {
          notRecognised: true,
        },
      });

      expect(testScope.userPreference.getPreferences()).toEqual(doNotConsentToAny);
    });

    it('should return do not consent to any if the version is not current', () => {
      setConsentCookie({
        version: '2020.1',
        preferences: {
          measurement: true,
        },
      });

      expect(testScope.userPreference.getPreferences()).toEqual(doNotConsentToAny);
    });

    it('should return each category when all are set via AcceptAll', () => {
      const { userPreference } = testScope;
      userPreference.userAcceptsAdditional();

      expect(userPreference.getPreferences()).toEqual(consentToAll);
    });

    it('should return each category when each category is set individually', () => {
      const { userPreference } = testScope;
      userPreference.setPreferences({
        measurement: true,
        settings: true,
      });

      expect(userPreference.getPreferences()).toEqual(consentToAll);
    });

    it('should return each category when each category is declined', () => {
      const { userPreference } = testScope;
      userPreference.setPreferences(doNotConsentToAny);

      expect(userPreference.getPreferences()).toEqual(doNotConsentToAny);
    });
  });

  describe('Save Preferences', () => {
    it('should save preferences to the cookie', () => {
      testScope.userPreference.setPreferences({
        measurement: true,
        settings: true,
      });
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2021.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          measurement: true,
          settings: true,
        },
      }, { sameSite: 'strict', expires: 365 });
    });
    it('should save other preferences to the cookie', () => {
      testScope.userPreference.setPreferences({
        measurement: false,
        settings: true,
      });
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2021.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          measurement: false,
          settings: true,
        },
      }, { sameSite: 'strict', expires: 365 });
    });
    it('should save only preferences specified', () => {
      testScope.userPreference.setPreferences({
        measurement: true,
      });
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2021.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          measurement: true,
        },
      }, { sameSite: 'strict', expires: 365 });
    });

    it('should call preference communicator', () => {
      assume(testScope.preferenceCommunicator.sendPreferences).not.toHaveBeenCalled();

      testScope.userPreference.setPreferences({
        measurement: true,
      });

      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake((userPreference) => {
        expect(userPreference.getPreferences()).toEqual({
          measurement: false,
          settings: true,
        });
      });

      testScope.userPreference.setPreferences({
        measurement: false,
        settings: true,
      });

      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake((userPreference) => {
        expect(userPreference.getPreferences()).toEqual({
          measurement: true,
          settings: false,
        });
      });

      testScope.userPreference.setPreferences({
        measurement: true,
        settings: false,
      });

      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });
  });

  describe('sendPreference', () => {
    it('should call preference communicator with the supplied event', () => {
      assume(testScope.preferenceCommunicator.sendPreferences).not.toHaveBeenCalled();

      testScope.userPreference.sendPreferences(SERVICE_PAGE_LOAD_EVENT);
      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, SERVICE_PAGE_LOAD_EVENT);
    });
  });

  describe('Meta tests', () => {
    it('datetime should be settable', () => {
      expect(new Date().toISOString()).toEqual(testScope.fakeDatetime);
      testScope.fakeDatetime = 123;
      expect(new Date().toISOString()).toEqual(123);
    });
    it('cookies should be settable and gettable', () => {
      expect(Cookies.get('abcdef')).toBeUndefined();
      Cookies.set('abcdef', 'this is my cookie value');
      expect(Cookies.get('abcdef')).toBe('this is my cookie value');
    });
    it('cookies should be settable with an object', () => {
      Cookies.set('abcdef', JSON.stringify({ thisIs: 'AnObject' }));
      expect(JSON.parse(Cookies.get('abcdef'))).toEqual({ thisIs: 'AnObject' });
    });
  });
});
