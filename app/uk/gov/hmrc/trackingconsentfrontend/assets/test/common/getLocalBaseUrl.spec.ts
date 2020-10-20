import '@testing-library/jest-dom/extend-expect'
import getLocalBaseUrl from '../../src/common/getLocalBaseUrl'

describe('getLocalBaseUrl', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script src="/another-script.js"></script>
        <script data-id="tracking-consent-frontend" src="http://localhost:54321/bundle.js"></script>
        <script src="/a-further-script.js"></script>
    </head>
    <body>
    </body>
</html> 
`
  })

  it('should return the port value', () => {
    const baseUrl = getLocalBaseUrl()

    expect(baseUrl).toEqual('http://localhost:54321')
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

    const baseUrl = getLocalBaseUrl()

    expect(baseUrl).toEqual('')
  })

  it('should return an empty string if port is not defined', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
          <script data-id="tracking-consent-frontend" src="/bundle.js"></script>
      </head>
      <body>
      </body>
  </html> 
  `

    const baseUrl = getLocalBaseUrl()

    expect(baseUrl).toEqual('')
  })

  it('should return an empty string if src is not defined', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
          <script data-id="tracking-consent-frontend"></script>
      </head>
      <body>
      </body>
  </html> 
  `

    const baseUrl = getLocalBaseUrl()

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

    const baseUrl = getLocalBaseUrl()

    expect(baseUrl).toEqual('')
  })
})
