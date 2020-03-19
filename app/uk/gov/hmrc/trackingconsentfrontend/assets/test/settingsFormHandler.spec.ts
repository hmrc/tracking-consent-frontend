// @ts-ignore
/* global spyOn */
import { JSDOM } from 'jsdom'
import * as fs from 'fs'
import * as path from 'path'
import { fireEvent } from '@testing-library/dom'
import settingsFormHandler from '../src/settingsFormHandler'
import userPreferenceFactory from '../src/userPreferenceFactory'
import castToArray from '../src/castToArray'

describe('User Preference Factory', () => {
  let testScope
  const assume = expect

  const pageLoad = () => {
    const event = testScope.document.createEvent('HTMLEvents')
    event.initEvent('DOMContentLoaded', true, true)
    testScope.document.dispatchEvent(event)
  }

  beforeEach(() => {
    const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'settingsForm.html'), 'utf8')
    const dom = new JSDOM(fixture)
    testScope = {
      document: dom.window.document
    }
    const allOnOptions = castToArray(testScope.document.querySelectorAll('[value=on]'))
    const allOffOptions = castToArray(testScope.document.querySelectorAll('[value=off]'))
    assume(allOnOptions.length).toBe(3)
    assume(allOffOptions.length).toBe(3)
    testScope.userPref = userPreferenceFactory()
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
  })
  describe('saving preferences', () => {
    beforeEach(() => {
      spyOn(testScope.userPref, 'setPreferences')
    })

    it('should save when usage only is granted', () => {
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      fireEvent.click(testScope.document.querySelector('[name=usage][value=on]'))
      fireEvent.submit(testScope.document.querySelector('form'))

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        usage: true,
        campaigns: false,
        settings: false
      })
    })
    it('should save when campaigns only is granted', () => {
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      fireEvent.click(testScope.document.querySelector('[name=campaigns][value=on]'))
      fireEvent.submit(testScope.document.querySelector('form'))

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        usage: false,
        campaigns: true,
        settings: false
      })
    })
    it('should save when settings only is granted', () => {
      settingsFormHandler(testScope.document, testScope.userPref)
      pageLoad()

      fireEvent.click(testScope.document.querySelector('[name=settings][value=on]'))
      fireEvent.submit(testScope.document.querySelector('form'))

      expect(testScope.userPref.setPreferences).toHaveBeenCalledWith({
        usage: false,
        campaigns: false,
        settings: true
      })
    })
  })
})
