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
    spyOn(Cookies, 'getJSON').and.callFake((cookieName) => testScope.cookieData[cookieName]);
    spyOn(Date.prototype, 'toISOString').and.callFake(() => testScope.fakeDatetime);
  });

  const setConsentCookie = (obj) => {
    testScope.cookieData.userConsent = { version: '2020.1', ...obj };
  };

  const expectTrackingPreferenceToHaveBeenSetWith = (preference) => {
    expect(Cookies.set).toHaveBeenCalledWith('userConsent', preference, expect.anything());
    expect(Cookies.set).toHaveBeenCalledTimes(1);
  };

  describe('getTrackingPreferencesSaved', () => {
    it('should determine if tracking preferences have been set', () => {
      setConsentCookie({ preferences: { acceptAll: true } });

      expect(testScope.userPreference.getUserHasSavedCookiePreferences()).toEqual(true);
    });

    it('should determine if tracking preferences have been set', () => {
      delete testScope.userConsent;

      expect(testScope.userPreference.getUserHasSavedCookiePreferences()).toEqual(false);
    });
  });

  describe('Accept All', () => {
    it('should set the cookie body with the JSON format', () => {
      testScope.userPreference.userAcceptsAll();
      expectTrackingPreferenceToHaveBeenSetWith({
        version: '2020.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          acceptAll: true,
        },
      });
    });

    it('should set the cookie body with the correct dateTime', () => {
      testScope.fakeDatetime = 987654321;
      testScope.userPreference.userAcceptsAll();
      expectTrackingPreferenceToHaveBeenSetWith({
        version: '2020.1',
        datetimeSet: 987654321,
        preferences: {
          acceptAll: true,
        },
      });
    });

    it('should set cookie security appropriately', () => {
      testScope.userPreference.userAcceptsAll();
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', expect.anything(), { sameSite: 'strict', expires: 3650 });
    });

    it('should call preference communicator', () => {
      assume(testScope.preferenceCommunicator.sendPreferences).not.toHaveBeenCalled();

      testScope.userPreference.userAcceptsAll();
      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake((userPreference) => {
        expect(userPreference.getPreferences()).toEqual({
          measurement: true,
          marketing: true,
          settings: true,
        });
      });

      testScope.userPreference.userAcceptsAll();
      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });
  });

  describe('getPreferences', () => {
    const getFakeAcceptAll = () => ({
      version: '2020.1',
      datetimeSet: testScope.fakeDatetime,
      preferences: {
        acceptAll: true,
      },
    });

    it('should return undefined when no preferences set', () => {
      setConsentCookie(undefined);

      expect(testScope.userPreference.getPreferences()).toEqual(undefined);
    });

    it('should return undefined when cookie value is not an object', () => {
      setConsentCookie('abc');

      expect(testScope.userPreference.getPreferences()).toEqual(undefined);
    });

    it('should return undefined when cookie value is the wrong shape', () => {
      setConsentCookie({ abc: 'abc' });

      expect(testScope.userPreference.getPreferences()).toEqual(undefined);
    });

    it('should only return partial data if partial data exists in the cookie', () => {
      setConsentCookie({ preferences: { measurement: true } });

      expect(testScope.userPreference.getPreferences()).toEqual({ measurement: true });
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

      expect(testScope.userPreference.getPreferences()).toEqual({ measurement: true });
    });

    it('should ignore any null values', () => {
      setConsentCookie({ preferences: { measurement: true, settings: null } });

      expect(testScope.userPreference.getPreferences()).toEqual({ measurement: true });
    });

    it('should ignore any undefined values', () => {
      setConsentCookie({ preferences: { measurement: true, settings: undefined } });

      expect(testScope.userPreference.getPreferences()).toEqual({ measurement: true });
    });

    it('should return each category when AcceptAll is set (fake data)', () => {
      setConsentCookie(getFakeAcceptAll());

      expect(testScope.userPreference.getPreferences()).toEqual({
        measurement: true,
        marketing: true,
        settings: true,
      });
    });

    it('should return undefined if AcceptAll is non-boolean but truthy', () => {
      setConsentCookie({
        preferences: {
          acceptAll: 'abc',
        },
      });

      expect(testScope.userPreference.getPreferences()).toEqual(undefined);
    });

    it('should return undefined if there are no valid preferences', () => {
      setConsentCookie({
        preferences: {
          notRecognised: true,
        },
      });

      expect(testScope.userPreference.getPreferences()).toEqual(undefined);
    });

    it('should return undefined if the version is not recognised', () => {
      setConsentCookie({
        version: '2010.1',
        preferences: {
          acceptAll: true,
        },
      });

      expect(testScope.userPreference.getPreferences()).toEqual(undefined);
    });

    it('should return each category when AcceptAll is set (function call)', () => {
      const { userPreference } = testScope;
      userPreference.userAcceptsAll();

      expect(userPreference.getPreferences()).toEqual({
        measurement: true,
        marketing: true,
        settings: true,
      });
    });

    it('should return each category when each category is set (function call)', () => {
      const { userPreference } = testScope;
      userPreference.setPreferences({
        measurement: true,
        marketing: true,
        settings: true,
      });

      expect(userPreference.getPreferences()).toEqual({
        measurement: true,
        marketing: true,
        settings: true,
      });
    });
    it('should return each category when each category is declined (function call)', () => {
      const { userPreference } = testScope;
      userPreference.setPreferences({
        measurement: false,
        marketing: false,
        settings: false,
      });

      expect(userPreference.getPreferences()).toEqual({
        measurement: false,
        marketing: false,
        settings: false,
      });
    });
  });

  describe('Save Preferences', () => {
    it('should save preferences to the cookie', () => {
      testScope.userPreference.setPreferences({
        measurement: true,
        marketing: false,
        settings: true,
      });
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2020.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          measurement: true,
          marketing: false,
          settings: true,
        },
      }, { sameSite: 'strict', expires: 3650 });
    });
    it('should save other preferences to the cookie', () => {
      testScope.userPreference.setPreferences({
        measurement: false,
        marketing: false,
        settings: true,
      });
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2020.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          measurement: false,
          marketing: false,
          settings: true,
        },
      }, { sameSite: 'strict', expires: 3650 });
    });
    it('should save only preferences specified', () => {
      testScope.userPreference.setPreferences({
        measurement: true,
      });
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2020.1',
        datetimeSet: testScope.fakeDatetime,
        preferences: {
          measurement: true,
        },
      }, { sameSite: 'strict', expires: 3650 });
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
          marketing: false,
          settings: true,
        });
      });

      testScope.userPreference.setPreferences({
        measurement: false,
        marketing: false,
        settings: true,
      });

      expect(testScope.preferenceCommunicator.sendPreferences)
        .toHaveBeenCalledWith(testScope.userPreference, CONSENT_UPDATED_EVENT);
    });

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake((userPreference) => {
        expect(userPreference.getPreferences()).toEqual({
          measurement: true,
          marketing: false,
          settings: false,
        });
      });

      testScope.userPreference.setPreferences({
        measurement: true,
        marketing: false,
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
      expect(Cookies.getJSON('abcdef')).toBeUndefined();
      Cookies.set('abcdef', 'this is my cookie value');
      expect(Cookies.getJSON('abcdef')).toBe('this is my cookie value');
    });
    it('cookies should be settable with an object', () => {
      Cookies.set('abcdef', { thisIs: 'AnObject' });
      expect(Cookies.getJSON('abcdef')).toEqual({ thisIs: 'AnObject' });
    });
  });
});
