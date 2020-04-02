// @ts-ignore
/* global spyOn */
import { JSDOM } from 'jsdom'
import { fireEvent } from '@testing-library/dom'
import settingsFormHandler from '../../src/ui/settingsFormHandler'
import userPreferenceFactory from '../../src/domain/userPreferenceFactory'
import castToArray from '../../src/common/castToArray'
// @ts-ignore
import fixture from '../fixtures/settingsForm.html'
import preferenceCommunicatorFactory from "../../src/interfaces/preferenceCommunicatorFactory";
import * as renderSettingsSaveConfirmationMessage from "../../src/ui/renderSettingsSaveConfirmationMessage";

describe('User Preference Factory', () => {
  let testScope
  const assume = expect

  const pageLoad = () => {
    const event = testScope.document.createEvent('HTMLEvents')
    event.initEvent('DOMContentLoaded', true, true)
    testScope.document.dispatchEvent(event)
  }

  beforeEach(() => {
    const dom = new JSDOM(fixture)
    testScope = {
      window: dom.window,
      document: dom.window.document
    }
    const allOnOptions = castToArray(testScope.document.querySelectorAll('[value=on]'))
    const allOffOptions = castToArray(testScope.document.querySelectorAll('[value=off]'))
    assume(allOnOptions.length).toBe(3)
    assume(allOffOptions.length).toBe(3)
    testScope.preferenceCommunicator = preferenceCommunicatorFactory(testScope.window)
    testScope.userPref = userPreferenceFactory(testScope.preferenceCommunicator)
    allOnOptions.forEach(option => {
      assume(option.checked).toBeFalsy()
    })
    allOffOptions.forEach(option => {
      assume(option.checked).toBeFalsy()
    })
  })

  describe('Initial state', () => {
    it('should select all for user who has allowed all', () => {
      spyOn(testScope.userPref, 'getPreferences').and.returnValue({
        usage: true,
        campaigns: true,
        settings: true
      })
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      expect(testScope.document.querySelector('[name=usage][value=on]').checked).toBeTruthy()
      expect(testScope.document.querySelector('[name=campaigns][value=on]').checked).toBeTruthy()
      expect(testScope.document.querySelector('[name=settings][value=on]').checked).toBeTruthy()

      expect(testScope.document.querySelector('[name=usage][value=off]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=campaigns][value=off]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=settings][value=off]').checked).toBeFalsy()
    })
    it('should select all for user who has declined all', () => {
      spyOn(testScope.userPref, 'getPreferences').and.returnValue({
        usage: false,
        campaigns: false,
        settings: false
      })
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      expect(testScope.document.querySelector('[name=usage][value=on]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=campaigns][value=on]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=settings][value=on]').checked).toBeFalsy()

      expect(testScope.document.querySelector('[name=usage][value=off]').checked).toBeTruthy()
      expect(testScope.document.querySelector('[name=campaigns][value=off]').checked).toBeTruthy()
      expect(testScope.document.querySelector('[name=settings][value=off]').checked).toBeTruthy()
    })
    it('should not select any for user who has not stored a preference', () => {
      spyOn(testScope.userPref, 'getPreferences').and.returnValue(undefined)
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      expect(testScope.document.querySelector('[name=usage][value=on]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=campaigns][value=on]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=settings][value=on]').checked).toBeFalsy()

      expect(testScope.document.querySelector('[name=usage][value=off]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=campaigns][value=off]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=settings][value=off]').checked).toBeFalsy()
    })
    it('should select specific items for user who stored a varied preference', () => {
      spyOn(testScope.userPref, 'getPreferences').and.returnValue({
        usage: true,
        campaigns: false,
        settings: true
      })
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      expect(testScope.document.querySelector('[name=usage][value=on]').checked).toBeTruthy()
      expect(testScope.document.querySelector('[name=campaigns][value=on]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=settings][value=on]').checked).toBeTruthy()

      expect(testScope.document.querySelector('[name=usage][value=off]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=campaigns][value=off]').checked).toBeTruthy()
      expect(testScope.document.querySelector('[name=settings][value=off]').checked).toBeFalsy()
    })
    it('should select specific items for user who stored only a partial preference', () => {
      spyOn(testScope.userPref, 'getPreferences').and.returnValue({
        usage: true
      })
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      expect(testScope.document.querySelector('[name=usage][value=on]').checked).toBeTruthy()
      expect(testScope.document.querySelector('[name=campaigns][value=on]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=settings][value=on]').checked).toBeFalsy()

      expect(testScope.document.querySelector('[name=usage][value=off]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=campaigns][value=off]').checked).toBeFalsy()
      expect(testScope.document.querySelector('[name=settings][value=off]').checked).toBeFalsy()
    })
  })
  describe('saving preferences', () => {
    beforeEach(() => {
      spyOn(testScope.userPref, 'setPreferences')
      spyOn(renderSettingsSaveConfirmationMessage, 'default')
    })

    it('should save when usage only is granted', () => {
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      fireEvent.click(testScope.document.querySelector('[name=usage][value=on]'))
      fireEvent.submit(testScope.document.querySelector('form'))

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        usage: true
      })
    })
    it('should save when campaigns only is granted', () => {
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      fireEvent.click(testScope.document.querySelector('[name=campaigns][value=on]'))
      fireEvent.submit(testScope.document.querySelector('form'))

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        campaigns: true
      })
    })
    it('should not store a value for items which don\'t appear in the form', () => {
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      testScope.document.querySelectorAll('input[type=radio]:not([name=settings])').forEach(elem => {
        elem.parentNode.removeChild(elem)
      })

      fireEvent.click(testScope.document.querySelector('[name=settings][value=off]'))
      fireEvent.submit(testScope.document.querySelector('form'))

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        settings: false
      })
    })

    it('should call renderSaveConfirmation', () => {
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      fireEvent.click(testScope.document.querySelector('[name=settings][value=off]'))
      fireEvent.submit(testScope.document.querySelector('form'))

      expect(renderSettingsSaveConfirmationMessage.default).toHaveBeenCalledTimes(1)
    })
  })
  describe('Technical details', () => {
    let pageLoadSync = () => {
      throw new Error('No page load event to fire')
    }

    beforeEach(() => {
      spyOn(testScope.document, 'addEventListener').and.callFake((name, fn) => {
        // if (name === 'DOMContentLoaded') {
        pageLoadSync = fn
        // }
      })
    })

    it('should error if the form doesn\'t have on value', () => {
      testScope.document.querySelector('form[data-module=cookie-settings]').removeAttribute('data-on-value')


      expect(() => {
        settingsFormHandler(testScope.document, testScope.userPref)
      }).toThrowError(new Error('Could not initiate form without on value being set'))
    })
    it('should error if the form doesn\'t have off value', () => {
      testScope.document.querySelector('form[data-module=cookie-settings]').removeAttribute('data-off-value')


      expect(() => {
        settingsFormHandler(testScope.document, testScope.userPref)
      }).toThrowError(new Error('Could not initiate form without off value being set'))
    })
    it('should default to the error message for the on value', () => {
      testScope.document.querySelector('form[data-module=cookie-settings]').removeAttribute('data-off-value')
      testScope.document.querySelector('form[data-module=cookie-settings]').removeAttribute('data-on-value')


      expect(() => {
        settingsFormHandler(testScope.document, testScope.userPref)
      }).toThrowError(new Error('Could not initiate form without on value being set'))
    })
  })
})
