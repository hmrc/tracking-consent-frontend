import getWelshLanguageEnabled from '../../src/interfaces/getWelshLanguageEnabled'

describe('getWelshLanguageEnabled', () => {
  it('should return true by default', () => {
    const enabled = getWelshLanguageEnabled()

    expect(enabled).toEqual(true)
  })
})
