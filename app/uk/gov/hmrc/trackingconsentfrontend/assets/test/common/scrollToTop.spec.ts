import scrollToTop from "../../src/common/scrollToTop";

describe('scrollToTop', () => {
    it('should set the document body scrollTop to zero', () => {
        document.body.scrollTop = 200
        expect(document.body.scrollTop).toEqual(200)

        scrollToTop()

        expect(document.body.scrollTop).toEqual(0)
    })

    it('should set the document documentElement scrollTop zero', () => {
        document.documentElement.scrollTop = 200
        expect(document.documentElement.scrollTop).toEqual(200)

        scrollToTop()

        expect(document.documentElement.scrollTop).toEqual(0)
    })
})