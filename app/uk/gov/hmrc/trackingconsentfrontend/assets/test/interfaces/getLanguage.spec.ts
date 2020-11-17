import getLanguage from '../../src/interfaces/getLanguage'

describe('getLanguage', () => {
  it('should return English by default', () => {
    const language = getLanguage()

    expect(language).toEqual('en')
  })

  it('should return Welsh if data-language is set to cy', () => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script id="tracking-consent-script-tag" data-language="cy"></script>
    </head>
    <body>
    </body>
</html> 
`

    const language = getLanguage()

    expect(language).toEqual('cy')
  })

  it('should return English if data-language is not recognised', () => {
    document.getElementsByTagName('html')[0].innerHTML = `<html>
    <head>
        <script id="tracking-consent-script-tag" data-language="de"></script>
    </head>
    <body>
    </body>
</html> 
`

    const language = getLanguage()

    expect(language).toEqual('en')
  })
})
