/* global spyOn */
import Cookies from 'js-cookie'
import userPreferenceFactory from '../../src/domain/userPreferenceFactory'

describe('User Preference Factory', () => {
  let testScope

  beforeEach(() => {
    testScope = { fakeDatetime: 1591234567890, cookieData: {} }
    spyOn(Cookies, 'set').and.callFake((cookieName, value) => { testScope.cookieData[cookieName] = value })
    spyOn(Cookies, 'getJSON').and.callFake(cookieName => testScope.cookieData[cookieName])
    spyOn(Date.prototype, 'getTime').and.callFake(() => testScope.fakeDatetime)
  })

  const setConsentCookie = obj => { testScope.cookieData.userConsent = { version: '2020-03-01', ...obj } }

  const expectTrackingPreferenceToHaveBeenSetWith = (preference) => {
    expect(Cookies.set).toHaveBeenCalledWith('userConsent', preference, expect.anything())
    expect(Cookies.set).toHaveBeenCalledTimes(1)
  }

  describe('getTrackingPreferencesSaved', () => {
    it('should determine if tracking preferences have been set', () => {
      setConsentCookie({ preferences: { acceptAll: true } })

      expect(userPreferenceFactory().getUserHasSavedCookiePreferences()).toEqual(true)
    })

    it('should determine if tracking preferences have been set', () => {
      delete testScope.userConsent

      expect(userPreferenceFactory().getUserHasSavedCookiePreferences()).toEqual(false)
    })
  })

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
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', expect.anything(), { sameSite: 'strict', expires: 3650 })
    })
  })

  describe('getPreferences', () => {
    const getFakeAcceptAll = () => ({
      version: '2020-03-01',
      dateSet: testScope.fakeDatetime,
      preferences: {
        acceptAll: true
      }
    })

    it('should return undefined when no preferences set', () => {
      setConsentCookie(undefined)

      expect(userPreferenceFactory().getPreferences()).toEqual(undefined)
    })

    it('should return undefined when cookie value is not an object', () => {
      setConsentCookie('abc')

      expect(userPreferenceFactory().getPreferences()).toEqual(undefined)
    })

    it('should return undefined when cookie value is the wrong shape', () => {
      setConsentCookie({ abc: 'abc' })

      expect(userPreferenceFactory().getPreferences()).toEqual(undefined)
    })

    it('should only return partial data if partial data exists in the cookie', () => {
      setConsentCookie({ preferences: { usage: true } })

      expect(userPreferenceFactory().getPreferences()).toEqual({ usage: true })
    })

    it('should interpret boolean false correctly', () => {
      setConsentCookie({ preferences: { usage: true, settings: false } })

      expect(userPreferenceFactory().getPreferences()).toEqual({ usage: true, settings: false })
    })

    it('should ignore any non-boolean data', () => {
      setConsentCookie({ preferences: { usage: true, settings: 'abc' } })

      expect(userPreferenceFactory().getPreferences()).toEqual({ usage: true })
    })

    it('should ignore any null values', () => {
      setConsentCookie({ preferences: { usage: true, settings: null } })

      expect(userPreferenceFactory().getPreferences()).toEqual({ usage: true })
    })

    it('should ignore any undefined values', () => {
      setConsentCookie({ preferences: { usage: true, settings: undefined } })

      expect(userPreferenceFactory().getPreferences()).toEqual({ usage: true })
    })

    it('should return each category when AcceptAll is set (fake data)', () => {
      setConsentCookie(getFakeAcceptAll())

      expect(userPreferenceFactory().getPreferences()).toEqual({
        usage: true,
        campaigns: true,
        settings: true
      })
    })

    it('should return undefined if AcceptAll is non-boolean but truthy', () => {
      setConsentCookie({
        preferences: {
          acceptAll: 'abc'
        }
      })

      expect(userPreferenceFactory().getPreferences()).toEqual(undefined)
    })

    it('should return undefined if there are no valid preferences', () => {
      setConsentCookie({
        preferences: {
          notRecognised: true
        }
      })

      expect(userPreferenceFactory().getPreferences()).toEqual(undefined)
    })

    it('should return undefined if the version is not recognised', () => {
      setConsentCookie({
        version: '2010-01-01',
        preferences: {
          acceptAll: true
        }
      })

      expect(userPreferenceFactory().getPreferences()).toEqual(undefined)
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
  })

  describe('Save Preferences', () => {
    it('should save preferences to the cookie', () => {
      userPreferenceFactory().setPreferences({
        usage: true,
        campaigns: false,
        settings: true
      })
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2020-03-01',
        dateSet: testScope.fakeDatetime,
        preferences: {
          usage: true,
          campaigns: false,
          settings: true
        }
      }, { sameSite: 'strict', expires: 3650 })
    })
    it('should save other preferences to the cookie', () => {
      userPreferenceFactory().setPreferences({
        usage: false,
        campaigns: false,
        settings: true
      })
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2020-03-01',
        dateSet: testScope.fakeDatetime,
        preferences: {
          usage: false,
          campaigns: false,
          settings: true
        }
      }, { sameSite: 'strict', expires: 3650 })
    })
    it('should save only preferences specified', () => {
      userPreferenceFactory().setPreferences({
        usage: true
      })
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2020-03-01',
        dateSet: testScope.fakeDatetime,
        preferences: {
          usage: true
        }
      }, { sameSite: 'strict', expires: 3650 })
    })
  })

  describe('Meta tests', () => {
    it('datetime should be settable', () => {
      expect(new Date().getTime()).toEqual(testScope.fakeDatetime)
      testScope.fakeDatetime = 123
      expect(new Date().getTime()).toEqual(123)
    })
    it('cookies should be settable and gettable', () => {
      expect(Cookies.getJSON('abcdef')).toBeUndefined()
      Cookies.set('abcdef', 'this is my cookie value')
      expect(Cookies.getJSON('abcdef')).toBe('this is my cookie value')
    })
    it('cookies should be settable with an object', () => {
      Cookies.set('abcdef', { thisIs: 'AnObject' })
      expect(Cookies.getJSON('abcdef')).toEqual({ thisIs: 'AnObject' })
    })
  })
})
