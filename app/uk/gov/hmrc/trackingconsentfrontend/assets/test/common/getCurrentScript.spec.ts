import '@testing-library/jest-dom/extend-expect'
import getCurrentScript from '../../src/common/getCurrentScript'

describe('getCurrentScript', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script src="/another-script.js"></script>
        <script data-id="tracking-consent-frontend" data-test="some-config"></script>
        <script src="/a-further-script.js"></script>
    </head>
    <body>
    </body>
</html> 
`
  })

  it('should return the correct script element', () => {
    const script = getCurrentScript()

    expect(script).not.toBeUndefined()
    if (script !== undefined) {
      expect(script.getAttribute('data-test')).toEqual('some-config')
    }
  })

  it('should return undefined if no script tag is found', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
      </head>
      <body>
      </body>
  </html> 
  `

    const script = getCurrentScript()

    expect(script).toBeUndefined()
  })

  it('should return undefined if id is not defined', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
          <script src="/another-script.js"></script>
      </head>
      <body>
      </body>
  </html> 
  `

    const script = getCurrentScript()

    expect(script).toBeUndefined()
  })
})
