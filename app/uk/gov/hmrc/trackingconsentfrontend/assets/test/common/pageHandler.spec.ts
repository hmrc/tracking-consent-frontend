/* global spyOn */
import * as enableGtm from '../../src/interfaces/enableGtm'
import pageHandler from '../../src/common/pageHandler'
import userPreferencesFactory from '../../src/domain/userPreferencesFactory'
import { JSDOM } from 'jsdom'
import * as isFeatureEnabled from '../../src/interfaces/isFeatureEnabled'
import { SERVICE_PAGE_LOAD_EVENT } from '../../src/constants/events'
import clearAllMocks = jest.clearAllMocks;

describe('pageHandler', () => {
  const pageRenderer = jest.fn()
  let thisDocument
  let testScope
  let featureEnabledSpy

  const pageLoad = () => {
    const event = thisDocument.createEvent('HTMLEvents')
    event.initEvent('DOMContentLoaded', true, true)
    thisDocument.dispatchEvent(event)
  }

  beforeEach(() => {
    // create a new Document on each test so event listeners are not added
    // multiple times
    const dom = new JSDOM('<html></html>')
    testScope = {
      document,
      window,
      userPreferences: userPreferencesFactory()
    }
    thisDocument = dom.window.document
    spyOn(enableGtm, 'default')
    spyOn(testScope.userPreferences, 'sendPreferences').and.returnValue(undefined)
    clearAllMocks()
    featureEnabledSpy = spyOn(isFeatureEnabled, 'default').and.returnValue(true)
    featureEnabledSpy.and.returnValue(true)
  })

  it('should enable GTM', () => {
    expect(enableGtm.default).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-CONTAINER-ID')

    expect(enableGtm.default).toHaveBeenCalledTimes(1)
    expect(enableGtm.default).toHaveBeenCalledWith('GTM-CONTAINER-ID')
  })

  it('should enable GTM with a different container id', () => {
    expect(enableGtm.default).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-TEST')

    expect(enableGtm.default).toHaveBeenCalledTimes(1)
    expect(enableGtm.default).toHaveBeenCalledWith('GTM-TEST')
  })

  it('should send the preferences', () => {
    expect(testScope.userPreferences.sendPreferences).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-CONTAINER-ID')

    expect(testScope.userPreferences.sendPreferences).toHaveBeenCalledTimes(1)
    expect(testScope.userPreferences.sendPreferences).toHaveBeenCalledWith(SERVICE_PAGE_LOAD_EVENT)
  })

  it('should call not call the page renderer if the DOM ContentReady event has not been fired', () => {
    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-CONTAINER-ID')

    expect(pageRenderer).not.toHaveBeenCalled()
  })

  it('should call the page renderer', () => {
    expect(pageRenderer).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-CONTAINER-ID')
    pageLoad()

    expect(pageRenderer).toHaveBeenCalledTimes(1)
  })

  it('should pass through userPreference to pageRenderer', () => {
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-CONTAINER-ID')
    pageLoad()

    expect(pageRenderer).toHaveBeenCalledWith(testScope.userPreferences)
  })

  it('should not call the page renderer if the feature toggle is toggled off', () => {
    featureEnabledSpy.and.returnValue(false)
    expect(pageRenderer).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-CONTAINER-ID')
    pageLoad()

    expect(pageRenderer).not.toHaveBeenCalled()
  })
})
