import getTrackingConsentBaseUrl from '../../src/common/getTrackingConsentBaseUrl'
// @ts-ignore
import fixture from '../fixtures/servicePageWithBannerMinimal.html'

describe('getTrackingConsentBaseUrl', () => {
  beforeEach(() => {
    delete window.location
    document.getElementsByTagName('html')[0].innerHTML = fixture
  })

  it('should return "" if running under https://www.tax.service.gov.uk', () => {
    // @ts-ignore
    window.location = {
      host: 'www.tax.service.gov.uk'
    }
    const url = getTrackingConsentBaseUrl()

    expect(url).toEqual('')
  })

  it('should return "http://localhost:12345" if running under http://localhost:9000/some-service', () => {
    // @ts-ignore
    window.location = {
      host: 'localhost:9000'
    }
    const url = getTrackingConsentBaseUrl()

    expect(url).toEqual('http://localhost:12345')
  })

  it('should fallback to "" if host is undefined', () => {
    // @ts-ignore
    window.location = {}

    const url = getTrackingConsentBaseUrl()

    expect(url).toEqual('')
  })

  it('should fallback to "" if host is not a string', () => {
    // @ts-ignore
    window.location = {}
    // @ts-ignore
    window.location.host = {}

    const url = getTrackingConsentBaseUrl()

    expect(url).toEqual('')
  })
})
