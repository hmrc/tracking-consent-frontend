import getReferrer from "../../src/common/getReferrer";

describe('getReferrer', () => {
    let documentReferrer
    Object.defineProperty(document, 'referrer', { get: () => documentReferrer });

    it('should return just the pathname', () => {
        documentReferrer = 'https://www.tax.service.gov.uk/another-service'

        const referrer = getReferrer()

        expect(referrer).toEqual('/another-service')
    })

    it('should return an empty string if no referrer has been set', () => {
        documentReferrer = ''
        const referrer = getReferrer()

        expect(referrer).toEqual('')
    })

    it('should return an empty string if the URL is not a function (for IE10 compatibility)', () => {
        documentReferrer = 'http://example.com/abc'
        // @ts-ignore
        window.URL = {}
        const referrer = getReferrer()

        expect(referrer).toEqual('')
    })
})
