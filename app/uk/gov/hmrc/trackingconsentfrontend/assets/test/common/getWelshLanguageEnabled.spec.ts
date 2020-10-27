import getWelshLanguageEnabled from '../../src/common/getWelshLanguageEnabled'

describe('getWelshLanguageEnabled', () => {
  it('should return false by default', () => {
    const enabled = getWelshLanguageEnabled()

    expect(enabled).toEqual(false)
  })
})
