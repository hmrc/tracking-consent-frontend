import * as gtm from "../../src/interfaces/gtm";
import clearAllMocks = jest.clearAllMocks;
import pageHandler from "../../src/common/pageHandler";
import { JSDOM } from 'jsdom'

describe('pageHandler', () => {
    const userPreferences = {
        sendPreferences: jest.fn()
    }
    const pageRenderer = jest.fn()
    let thisDocument

    const pageLoad = () => {
        const event = thisDocument.createEvent('HTMLEvents')
        event.initEvent('DOMContentLoaded', true, true)
        thisDocument.dispatchEvent(event)
    }

    beforeEach(() => {
        // create a new Document on each test so event listeners are not added
        // multiple times
        const dom = new JSDOM('<html></html>')
        thisDocument = dom.window.document
        spyOn(gtm, 'default')
        clearAllMocks();
    })


    it('should enable GTM', () => {
        expect(gtm.default).not.toHaveBeenCalled()

        // @ts-ignore
        pageHandler(thisDocument, userPreferences, pageRenderer)

        expect(gtm.default).toHaveBeenCalledTimes(1)
    })

    it ('should send the preferences', () => {
        expect(userPreferences.sendPreferences).not.toHaveBeenCalled()

        // @ts-ignore
        pageHandler(thisDocument, userPreferences, pageRenderer)

        expect(userPreferences.sendPreferences).toHaveBeenCalledTimes(1)
    })

    it('should call not call the page renderer if the DOM ContentReady event has not been fired', () => {
        // @ts-ignore
        pageHandler(thisDocument, userPreferences, pageRenderer)

        expect(pageRenderer).not.toHaveBeenCalled()
    })

    it('should call the page renderer', () => {
        expect(pageRenderer).not.toHaveBeenCalled()

        // @ts-ignore
        pageHandler(thisDocument, userPreferences, pageRenderer)
        pageLoad()

        expect(pageRenderer).toHaveBeenCalledTimes(1)
    })

})