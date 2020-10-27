import '@testing-library/jest-dom/extend-expect'
import getConfigurationAttribute from '../../src/common/getConfigurationAttribute'

describe('getConfigurationAttribute', () => {
  it('should return the correct attribute value', () => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script id="tracking-consent-script-tag" data-foo="f"></script>
    </head>
    <body>
    </body>
</html> 
`
    const foo = getConfigurationAttribute('foo')

    expect(foo).toEqual('f')
  })

  it('should return the correct different attribute value', () => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script id="tracking-consent-script-tag" data-bar="b"></script>
    </head>
    <body>
    </body>
</html> 
`
    const bar = getConfigurationAttribute('bar')

    expect(bar).toEqual('b')
  })

  it('should return undefined if the given attribute is not present', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
          <script id="tracking-consent-script-tag"></script>
      </head>
      <body>
      </body>
  </html> 
  `

    const bar = getConfigurationAttribute('bar')

    expect(bar).toBeUndefined()
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

    const bar = getConfigurationAttribute('bar')

    expect(bar).toBeUndefined()
  })
})
