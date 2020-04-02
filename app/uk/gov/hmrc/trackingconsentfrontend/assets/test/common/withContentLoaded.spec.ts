import clearAllMocks = jest.clearAllMocks;
import withContentLoaded from "../../src/common/withContentLoaded";
import { JSDOM } from 'jsdom'

describe('withContentLoaded', () => {
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
        clearAllMocks();
    })

    it('should not call the page renderer initially', () => {
        const composedRenderer = withContentLoaded(pageRenderer)
        composedRenderer(thisDocument, 'arg1')

        expect(pageRenderer).not.toHaveBeenCalled()
    })

    it('should call the page renderer once the pageLoad event has been fired', () => {
        const composedRenderer = withContentLoaded(pageRenderer)
        composedRenderer(thisDocument, 'arg1')
        expect(pageRenderer).not.toHaveBeenCalled()

        pageLoad()

        expect(pageRenderer).toHaveBeenCalledTimes(1)
    })

    it('should call the page renderer once the page load event has been fired with the correct parameters', () => {
        const composedRenderer = withContentLoaded(pageRenderer)
        composedRenderer(thisDocument, 'arg1')
        expect(pageRenderer).not.toHaveBeenCalled()

        pageLoad()

        expect(pageRenderer).toHaveBeenCalledWith(thisDocument, 'arg1')
    })
})