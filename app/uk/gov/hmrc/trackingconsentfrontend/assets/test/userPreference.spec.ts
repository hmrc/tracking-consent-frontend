/* global jasmine, spyOn */
import Cookies from 'js-cookie'
import userPreferenceFactory from '../src/userPreferenceFactory'
import anything = jasmine.anything;

describe('User Preference Factory', () => {
  let fakeDateTime = 1591234567890

  beforeEach(() => {
    spyOn(Cookies, 'set')
    spyOn(Date.prototype, 'getTime').and.callFake(() => fakeDateTime)
  })

  const expectTrackingPreferenceToHaveBeenSetWith = (preference) => {
    expect(Cookies.set).toHaveBeenCalledWith('userConsent', JSON.stringify(preference), anything())
    expect(Cookies.set).toHaveBeenCalledTimes(1)
  }

  it('should set the cookie body with the JSON format', () => {
    userPreferenceFactory().userAcceptsAll()
    expectTrackingPreferenceToHaveBeenSetWith({
      version: '2020-01-01',
      dateSet: fakeDateTime,
      preferences: {
        acceptAll: true
      }
    })
  })

  it('should set the cookie body with the correct dateTime', () => {
    fakeDateTime = 987654321
    userPreferenceFactory().userAcceptsAll()
    expectTrackingPreferenceToHaveBeenSetWith({
      version: '2020-01-01',
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

  describe('Meta tests', () => {
    it('datetime should be settable', () => {
      expect(new Date().getTime()).toEqual(fakeDateTime)
      fakeDateTime = 123
      expect(new Date().getTime()).toEqual(123)
    })
  })
})
