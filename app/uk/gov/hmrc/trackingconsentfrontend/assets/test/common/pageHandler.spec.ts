/* global spyOn */
import * as gtm from '../../src/interfaces/gtm'
import pageHandler from '../../src/common/pageHandler'
import { JSDOM } from 'jsdom'
import userPreferenceFactory from '../../src/domain/userPreferenceFactory'
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
      userPreferences: userPreferenceFactory(dom.window)
    }
    thisDocument = dom.window.document
    spyOn(gtm, 'default')
    spyOn(testScope.userPreferences, 'sendPreferences').and.returnValue(undefined)
    clearAllMocks()
  })

  it('should enable GTM', () => {
    expect(gtm.default).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer)

    expect(gtm.default).toHaveBeenCalledTimes(1)
  })

  it('should send the preferences', () => {
    expect(testScope.userPreferences.sendPreferences).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer)

    expect(testScope.userPreferences.sendPreferences).toHaveBeenCalledTimes(1)
  })

  it('should call not call the page renderer if the DOM ContentReady event has not been fired', () => {
    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer)

    expect(pageRenderer).not.toHaveBeenCalled()
  })

  it('should call the page renderer', () => {
    expect(pageRenderer).not.toHaveBeenCalled()

    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer)
    pageLoad()

    expect(pageRenderer).toHaveBeenCalledTimes(1)
  })

  it('should pass through userPreference to pageRenderer', () => {
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer)
    pageLoad()

    expect(pageRenderer).toHaveBeenCalledWith(testScope.userPreferences)
  })
})
