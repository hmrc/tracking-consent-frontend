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

  it('should return "http://localhost:12345" if running under locally', () => {
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

  it('should return an empty string if no script tag is found', () => {
    // @ts-ignore
    window.location = {
      host: 'localhost:9000'
    }
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
      </head>
      <body>
      </body>
  </html> 
  `

    const baseUrl = getTrackingConsentBaseUrl()

    expect(baseUrl).toEqual('')
  })

  it('should return an empty string if src is not defined', () => {
    // @ts-ignore
    window.location = {
      host: 'localhost:9000'
    }
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
          <script id="tracking-consent-script-tag"></script>
      </head>
      <body>
      </body>
  </html> 
  `

    const baseUrl = getTrackingConsentBaseUrl()

    expect(baseUrl).toEqual('')
  })

  it('should return an empty string if id is not defined', () => {
    // @ts-ignore
    window.location = {
      host: 'localhost:9000'
    }
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
          <script src="/another-script.js"></script>
      </head>
      <body>
      </body>
  </html> 
  `

    const baseUrl = getTrackingConsentBaseUrl()

    expect(baseUrl).toEqual('')
  })

  it('should return the correct url if the port is non-standard', () => {
    // @ts-ignore
    window.location = {
      host: 'localhost:9000'
    }
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script src="/another-script.js"></script>
        <script id="tracking-consent-script-tag" src="http://localhost:54321/bundle.js"></script>
        <script src="/a-further-script.js"></script>
    </head>
    <body>
    </body>
</html> 
`
    const baseUrl = getTrackingConsentBaseUrl()

    expect(baseUrl).toEqual('http://localhost:54321')
  })

  it('should return an empty string if port is not defined', () => {
    // @ts-ignore
    window.location = {
      host: 'localhost:9000'
    }
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
          <script id="tracking-consent-script-tag" src="/bundle.js"></script>
      </head>
      <body>
      </body>
  </html> 
  `

    const baseUrl = getTrackingConsentBaseUrl()

    expect(baseUrl).toEqual('')
  })
})
