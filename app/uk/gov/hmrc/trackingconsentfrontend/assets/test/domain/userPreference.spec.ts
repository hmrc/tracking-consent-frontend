/* global spyOn */
import Cookies from 'js-cookie'
import userPreferenceFactory from '../../src/domain/userPreferenceFactory'
import preferenceCommunicatorFactory from "../../src/interfaces/preferenceCommunicatorFactory";

describe('User Preference Factory', () => {
  const assume = expect
  let testScope

  beforeEach(() => {
    testScope = {fakeDatetime: 1591234567890, cookieData: {}}
    testScope.preferenceCommunicator = preferenceCommunicatorFactory({})
    spyOn(testScope.preferenceCommunicator, 'sendPreferences')
    testScope.userPreference = userPreferenceFactory(testScope.preferenceCommunicator)
    spyOn(Cookies, 'set').and.callFake((cookieName, value) => {
      testScope.cookieData[cookieName] = value
    })
    spyOn(Cookies, 'getJSON').and.callFake(cookieName => testScope.cookieData[cookieName])
    spyOn(Date.prototype, 'getTime').and.callFake(() => testScope.fakeDatetime)
  })

  const setConsentCookie = obj => {
    testScope.cookieData.userConsent = {version: '2020-03-01', ...obj}
  }

  const expectTrackingPreferenceToHaveBeenSetWith = (preference) => {
    expect(Cookies.set).toHaveBeenCalledWith('userConsent', preference, expect.anything())
    expect(Cookies.set).toHaveBeenCalledTimes(1)
  }

  describe('getTrackingPreferencesSaved', () => {
    it('should determine if tracking preferences have been set', () => {
      setConsentCookie({preferences: {acceptAll: true}})

      expect(testScope.userPreference.getUserHasSavedCookiePreferences()).toEqual(true)
    })

    it('should determine if tracking preferences have been set', () => {
      delete testScope.userConsent

      expect(testScope.userPreference.getUserHasSavedCookiePreferences()).toEqual(false)
    })
  })

  describe('Accept All', () => {
    it('should set the cookie body with the JSON format', () => {
      testScope.userPreference.userAcceptsAll()
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
      testScope.userPreference.userAcceptsAll()
      expectTrackingPreferenceToHaveBeenSetWith({
        version: '2020-03-01',
        dateSet: 987654321,
        preferences: {
          acceptAll: true
        }
      })
    })

    it('should set cookie security appropriately', () => {
      testScope.userPreference.userAcceptsAll()
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', expect.anything(), {sameSite: 'strict', expires: 3650})
    })

    it('should call preference communicator', () => {
      assume(testScope.preferenceCommunicator.sendPreferences).not.toHaveBeenCalled()

      testScope.userPreference.userAcceptsAll()
      expect(testScope.preferenceCommunicator.sendPreferences).toHaveBeenCalledWith(testScope.userPreference)
    })

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake(userPreference => {
        expect(userPreference.getPreferences()).toEqual({
          usage: true,
          campaigns: true,
          settings: true
        })
      })

      testScope.userPreference.userAcceptsAll()
      expect(testScope.preferenceCommunicator.sendPreferences).toHaveBeenCalledWith(testScope.userPreference)
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

      expect(testScope.userPreference.getPreferences()).toEqual(undefined)
    })

    it('should return undefined when cookie value is not an object', () => {
      setConsentCookie('abc')

      expect(testScope.userPreference.getPreferences()).toEqual(undefined)
    })

    it('should return undefined when cookie value is the wrong shape', () => {
      setConsentCookie({abc: 'abc'})

      expect(testScope.userPreference.getPreferences()).toEqual(undefined)
    })

    it('should only return partial data if partial data exists in the cookie', () => {
      setConsentCookie({preferences: {usage: true}})

      expect(testScope.userPreference.getPreferences()).toEqual({usage: true})
    })

    it('should interpret boolean false correctly', () => {
      setConsentCookie({preferences: {usage: true, settings: false}})

      expect(testScope.userPreference.getPreferences()).toEqual({usage: true, settings: false})
    })

    it('should ignore any non-boolean data', () => {
      setConsentCookie({preferences: {usage: true, settings: 'abc'}})

      expect(testScope.userPreference.getPreferences()).toEqual({usage: true})
    })

    it('should ignore any null values', () => {
      setConsentCookie({preferences: {usage: true, settings: null}})

      expect(testScope.userPreference.getPreferences()).toEqual({usage: true})
    })

    it('should ignore any undefined values', () => {
      setConsentCookie({preferences: {usage: true, settings: undefined}})

      expect(testScope.userPreference.getPreferences()).toEqual({usage: true})
    })

    it('should return each category when AcceptAll is set (fake data)', () => {
      setConsentCookie(getFakeAcceptAll())

      expect(testScope.userPreference.getPreferences()).toEqual({
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

      expect(testScope.userPreference.getPreferences()).toEqual(undefined)
    })

    it('should return undefined if there are no valid preferences', () => {
      setConsentCookie({
        preferences: {
          notRecognised: true
        }
      })

      expect(testScope.userPreference.getPreferences()).toEqual(undefined)
    })

    it('should return undefined if the version is not recognised', () => {
      setConsentCookie({
        version: '2010-01-01',
        preferences: {
          acceptAll: true
        }
      })

      expect(testScope.userPreference.getPreferences()).toEqual(undefined)
    })

    it('should return each category when AcceptAll is set (function call)', () => {
      const userPreference = testScope.userPreference
      userPreference.userAcceptsAll()

      expect(userPreference.getPreferences()).toEqual({
        usage: true,
        campaigns: true,
        settings: true
      })
    })

    it('should return each category when each category is set (function call)', () => {
      const userPreference = testScope.userPreference
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
      const userPreference = testScope.userPreference
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
      testScope.userPreference.setPreferences({
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
      }, {sameSite: 'strict', expires: 3650})
    })
    it('should save other preferences to the cookie', () => {
      testScope.userPreference.setPreferences({
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
      }, {sameSite: 'strict', expires: 3650})
    })
    it('should save only preferences specified', () => {
      testScope.userPreference.setPreferences({
        usage: true
      })
      expect(Cookies.set).toHaveBeenCalledWith('userConsent', {
        version: '2020-03-01',
        dateSet: testScope.fakeDatetime,
        preferences: {
          usage: true
        }
      }, {sameSite: 'strict', expires: 3650})
    })

    it('should call preference communicator', () => {
      assume(testScope.preferenceCommunicator.sendPreferences).not.toHaveBeenCalled()

      testScope.userPreference.setPreferences({
        usage: true
      })

      expect(testScope.preferenceCommunicator.sendPreferences).toHaveBeenCalledWith(testScope.userPreference)
    })

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake(userPreference => {
        expect(userPreference.getPreferences()).toEqual({
          usage: false,
          campaigns: false,
          settings: true
        })
      })

      testScope.userPreference.setPreferences({
        usage: false,
        campaigns: false,
        settings: true
      })

      expect(testScope.preferenceCommunicator.sendPreferences).toHaveBeenCalledWith(testScope.userPreference)
    })

    it('should call preference communicator after preferences were set', () => {
      testScope.preferenceCommunicator.sendPreferences.and.callFake(userPreference => {
        expect(userPreference.getPreferences()).toEqual({
          usage: true,
          campaigns: false,
          settings: false
        })
      })

      testScope.userPreference.setPreferences({
        usage: true,
        campaigns: false,
        settings: false
      })

      expect(testScope.preferenceCommunicator.sendPreferences).toHaveBeenCalledWith(testScope.userPreference)
    })
  })

  describe('sendPreference', () => {
    it('should call preference communicator', () => {
      assume(testScope.preferenceCommunicator.sendPreferences).not.toHaveBeenCalled()

      testScope.userPreference.sendPreferences()
      expect(testScope.preferenceCommunicator.sendPreferences).toHaveBeenCalledWith(testScope.userPreference)
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
      Cookies.set('abcdef', {thisIs: 'AnObject'})
      expect(Cookies.getJSON('abcdef')).toEqual({thisIs: 'AnObject'})
    })
  })
})