import '@testing-library/jest-dom/extend-expect'
import getGtmContainerId from '../../src/common/getGtmContainerId'
import { A_CONTAINER_ID, SDES_CONTAINER_ID } from '../../src/constants/gtm'

describe('getGtmContainer', () => {
  it('should return the correct container id for the "a" container', () => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script id="tracking-consent-script-tag" data-gtm-container="a"></script>
    </head>
    <body>
    </body>
</html> 
`
    const container = getGtmContainerId()

    expect(container).toEqual(A_CONTAINER_ID)
  })

  it('should return the correct container id for the "sdes" container', () => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script id="tracking-consent-script-tag" data-gtm-container="sdes"></script>
    </head>
    <body>
    </body>
</html> 
`
    const container = getGtmContainerId()

    expect(container).toEqual(SDES_CONTAINER_ID)
  })

  it('should return undefined if the data-gtm-container attribute is not present', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
  <html>
      <head>
          <script id="tracking-consent-script-tag"></script>
      </head>
      <body>
      </body>
  </html> 
  `

    const container = getGtmContainerId()

    expect(container).toBeUndefined()
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

    const container = getGtmContainerId()

    expect(container).toBeUndefined()
  })
})
