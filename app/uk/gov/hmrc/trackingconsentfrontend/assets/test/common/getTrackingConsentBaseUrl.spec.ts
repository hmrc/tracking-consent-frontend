import getTrackingConsentBaseUrl from '../../src/common/getTrackingConsentBaseUrl'
// @ts-ignore
import fixture from '../fixtures/servicePageWithBannerMinimal.html'

describe('getTrackingConsentBaseUrl', () => {
  beforeEach(() => {
    delete window.location
    document.getElementsByTagName('html')[0].innerHTML = fixture
  })

  it('should return "https://www.tax.service.gov.uk" if running under https://www.tax.service.gov.uk', () => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script id="tracking-consent-script-tag" src="https://www.tax.service.gov.uk/bundle.js"></script>
    </head>
    <body>
    </body>
</html> 
`
    const url = getTrackingConsentBaseUrl()

    expect(url).toEqual('https://www.tax.service.gov.uk')
  })

  it('should return "http://localhost:12345" if running under locally', () => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script id="tracking-consent-script-tag" src="http://localhost:12345/bundle.js"></script>
    </head>
    <body>
    </body>
</html> 
`
    const url = getTrackingConsentBaseUrl()

    expect(url).toEqual('http://localhost:12345')
  })

  it('should return an empty string if no script tag is found', () => {
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
})
