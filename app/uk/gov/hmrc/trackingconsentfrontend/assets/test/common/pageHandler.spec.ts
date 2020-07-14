/* global spyOn */
import * as gtm from '../../src/interfaces/gtm'
import pageHandler from '../../src/common/pageHandler'
import userPreferencesFactory from '../../src/domain/userPreferencesFactory'
import { JSDOM } from 'jsdom'
import clearAllMocks = jest.clearAllMocks;

describe('pageHandler', () => {
  const pageRenderer = jest.fn()
  let thisDocument
  let testScope

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
    spyOn(gtm, 'default')
    spyOn(testScope.userPreferences, 'sendPreferences').and.returnValue(undefined)
    clearAllMocks()
  })

  it('should enable GTM', () => {
    expect(gtm.default).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-CONTAINER-ID')

    expect(gtm.default).toHaveBeenCalledTimes(1)
    expect(gtm.default).toHaveBeenCalledWith('GTM-CONTAINER-ID')
  })

  it('should enable GTM with a different container id', () => {
    expect(gtm.default).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-TEST')

    expect(gtm.default).toHaveBeenCalledTimes(1)
    expect(gtm.default).toHaveBeenCalledWith('GTM-TEST')
  })

  it('should send the preferences', () => {
    expect(testScope.userPreferences.sendPreferences).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer, 'GTM-CONTAINER-ID')

    expect(testScope.userPreferences.sendPreferences).toHaveBeenCalledTimes(1)
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
})
