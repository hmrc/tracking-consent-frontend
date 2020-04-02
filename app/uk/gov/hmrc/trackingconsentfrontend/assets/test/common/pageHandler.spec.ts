import * as gtm from "../../src/interfaces/gtm";
import clearAllMocks = jest.clearAllMocks;
import pageHandler from "../../src/common/pageHandler";

describe('pageHandler', () => {
    const userPreferences = {
        sendPreferences: jest.fn()
    }
    const pageRenderer = jest.fn()

    beforeEach(() => {
        spyOn(gtm, 'default')
        clearAllMocks()
    })

    it('should enable GTM', () => {
        expect(gtm.default).not.toHaveBeenCalled()

        // @ts-ignore
        pageHandler(userPreferences, pageRenderer)

        expect(gtm.default).toHaveBeenCalledTimes(1)
    })

    it('should call the page renderer', () => {
        expect(pageRenderer).not.toHaveBeenCalled()

        // @ts-ignore
        pageHandler(userPreferences, pageRenderer)

        expect(pageRenderer).toHaveBeenCalledTimes(1)
    })

    it ('should send the preferences', () => {
        expect(userPreferences.sendPreferences).not.toHaveBeenCalled()

        // @ts-ignore
        pageHandler(userPreferences, pageRenderer)

        expect(userPreferences.sendPreferences).toHaveBeenCalledTimes(1)
    })
})