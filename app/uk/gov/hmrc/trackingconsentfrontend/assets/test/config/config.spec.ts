import '@testing-library/jest-dom/extend-expect'
import { getBaseUrl } from '../../src/config/config'

describe('config', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script src="/another-script.js"></script>
        <script data-id="tracking-consent-frontend" data-port="54321" src="/bundle.js"></script>
        <script src="/a-further-script.js"></script>
    </head>
    <body>
    </body>
</html> 
`
  })

  describe('getBaseUrl', () => {
    it('should return the port value', () => {
      const baseUrl = getBaseUrl()

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

      const baseUrl = getBaseUrl()

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

      const baseUrl = getBaseUrl()

      expect(baseUrl).toEqual('')
    })

    it('should return an empty string if data-id is not defined', () => {
      document.getElementsByTagName('html')[0].innerHTML = `
    <html>
        <head>
            <script src="/another-script.js" data-port="11111"></script>
        </head>
        <body>
        </body>
    </html> 
    `

      const baseUrl = getBaseUrl()

      expect(baseUrl).toEqual('')
    })
  })
})
