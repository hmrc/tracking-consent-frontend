import getLanguage from '../../src/interfaces/getLanguage'
import Cookies from 'js-cookie'

describe('getLanguage', () => {
  beforeEach(() => {
    Cookies.remove('PLAY_LANG')
  })

  it('should return English by default', () => {
    const language = getLanguage()

    expect(language).toEqual('en')
  })

  it('should return Welsh if PLAY_LANG is set to cy', () => {
    Cookies.set('PLAY_LANG', 'cy')

    const language = getLanguage()

    expect(language).toEqual('cy')
  })
})
