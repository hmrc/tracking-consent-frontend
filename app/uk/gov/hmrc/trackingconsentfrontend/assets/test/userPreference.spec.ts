/* global jasmine, spyOn */
import Cookies from 'js-cookie'
import userPreferenceFactory from '../src/userPreferenceFactory'
import anything = jasmine.anything;

describe('User Preference Factory', () => {
  let testScope

  beforeEach(() => {
    testScope = { fakeDatetime: 1591234567890, cookieData: {} }
    spyOn(Cookies, 'set').and.callFake((cookieName, value) => { testScope.cookieData[cookieName] = value })
    spyOn(Cookies, 'get').and.callFake(cookieName => testScope.cookieData[cookieName])
    spyOn(Date.prototype, 'getTime').and.callFake(() => testScope.fakeDatetime)
  })

  const setConsentCookie = obj => { testScope.cookieData.userConsent = JSON.stringify(obj) }

  const expectTrackingPreferenceToHaveBeenSetWith = (preference) => {
    expect(Cookies.set).toHaveBeenCalledWith('userConsent', JSON.stringify(preference), anything())
    expect(Cookies.set).toHaveBeenCalledTimes(1)
  }

  describe('Accept All', () => {
    it('should set the cookie body with the JSON format', () => {
      userPreferenceFactory().userAcceptsAll()
      expectTrackingPreferenceToHaveBeenSetWith({
        version: '2020-03-01',
        dateSet: testScope.fakeDatetime,
        preferences: {
          acceptAll: true
        }
      })
    })

    it('should set the cookie body with the correct dateTime', () => {
      testScope.fakeDatetime = 987654321
      userPreferenceFactory().userAcceptsAll()
      expectTrackingPreferenceToHaveBeenSetWith({
        version: '2020-03-01',
        dateSet: 987654321,
        preferences: {
          acceptAll: true
        }
      })
    })

    it('should set cookie security appropriately', () => {
      userPreferenceFactory().userAcceptsAll()
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', anything(), { sameSite: 'strict', expires: 3650 })
    })
  })

  describe('Get Preferences', () => {
    const getFakeAcceptAll = () => ({
      version: '2020-03-01',
      dateSet: testScope.fakeDatetime,
      preferences: {
        acceptAll: true
      }
    })

    it('should return undefined when no preferences set', () => {
      testScope.cookieData.userConsent = undefined

      expect(userPreferenceFactory().getPreferences()).toEqual(undefined)
    })
    it('should return each category when AcceptAll is set (fake data)', () => {
      setConsentCookie(getFakeAcceptAll())

      expect(userPreferenceFactory().getPreferences()).toEqual({
        usage: true,
        campaigns: true,
        settings: true
      })
    })
    it('should return each category when AcceptAll is set (function call)', () => {
      const userPreference = userPreferenceFactory()
      userPreference.userAcceptsAll()

      expect(userPreference.getPreferences()).toEqual({
        usage: true,
        campaigns: true,
        settings: true
      })
    })
    it('should return each category when each category is set (function call)', () => {
      const userPreference = userPreferenceFactory()
      userPreference.setPreferences({
        usage: true,
        campaigns: true,
        settings: true
      })

      expect(userPreference.getPreferences()).toEqual({
        usage: true,
        campaigns: true,
        settings: true
      })
    })
    it('should return each category when each category is declined (function call)', () => {
      const userPreference = userPreferenceFactory()
      userPreference.setPreferences({
        usage: false,
        campaigns: false,
        settings: false
      })

      expect(userPreference.getPreferences()).toEqual({
        usage: false,
        campaigns: false,
        settings: false
      })
    })
    it('should return each category when only some categories are set (function call)', () => {
      const userPreference = userPreferenceFactory()
      userPreference.setPreferences({
        usage: true,
        campaigns: false
      })

      expect(userPreference.getPreferences()).toEqual({
        usage: true,
        campaigns: false,
        settings: false
      })
    })
  })

  describe('Save Preferences', () => {
    it('should save preferences to the cookie', () => {
      userPreferenceFactory().setPreferences({
        usage: true,
        campaigns: false,
        settings: true
      })
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', JSON.stringify({
        version: '2020-03-01',
        dateSet: testScope.fakeDatetime,
        preferences: {
          usage: true,
          campaigns: false,
          settings: true
        }
      }), { sameSite: 'strict', expires: 3650 })
    })
    it('should save other preferences to the cookie', () => {
      userPreferenceFactory().setPreferences({
        usage: false,
        campaigns: false,
        settings: true
      })
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', JSON.stringify({
        version: '2020-03-01',
        dateSet: testScope.fakeDatetime,
        preferences: {
          usage: false,
          campaigns: false,
          settings: true
        }
      }), { sameSite: 'strict', expires: 3650 })
    })
    it('should save only preferences specified', () => {
      userPreferenceFactory().setPreferences({
        usage: true
      })
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', JSON.stringify({
        version: '2020-03-01',
        dateSet: testScope.fakeDatetime,
        preferences: {
          usage: true
        }
      }), { sameSite: 'strict', expires: 3650 })
    })
  })

  describe('Meta tests', () => {
    it('datetime should be settable', () => {
      expect(new Date().getTime()).toEqual(testScope.fakeDatetime)
      testScope.fakeDatetime = 123
      expect(new Date().getTime()).toEqual(123)
    })
    it('cookies should be settable and gettable', () => {
      expect(Cookies.get('abcdef')).toBeUndefined()
      Cookies.set('abcdef', 'this is my cookie value')
      expect(Cookies.get('abcdef')).toBe('this is my cookie value')
    })
  })
})
