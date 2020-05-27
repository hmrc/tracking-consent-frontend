/* global spyOn */
import getMessages from '../../src/interfaces/getMessages'
import * as getLanguage from '../../src/interfaces/getLanguage'
import * as getWelshLanguageEnabled from '../../src/interfaces/getWelshLanguageEnabled'

describe('getMessages', () => {
  let getLanguageSpy
  let getWelshLanguageEnabledSpy
  beforeEach(() => {
    getLanguageSpy = spyOn(getLanguage, 'default').and.returnValue('en')
    getWelshLanguageEnabledSpy = spyOn(getWelshLanguageEnabled, 'default').and.returnValue(true)
  })

  it('should return English messages by default', () => {
    const messages = getMessages()

    expect(messages['cookieSettings.title']).toEqual('Cookie settings on HMRC services')
  })

  it('should return Welsh messages if appropriate', () => {
    getLanguageSpy.and.returnValue('cy')

    const messages = getMessages()

    expect(messages['cookieSettings.title']).toEqual('Lorem ipsum')
  })

  it('should still return English messages if welsh language support is not enabled', () => {
    getLanguageSpy.and.returnValue('cy')
    getWelshLanguageEnabledSpy.and.returnValue(false)

    const messages = getMessages()

    expect(messages['cookieSettings.title']).toEqual('Cookie settings on HMRC services')
  })
})
