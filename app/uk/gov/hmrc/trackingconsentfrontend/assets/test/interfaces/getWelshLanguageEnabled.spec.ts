import { getWelshLanguageEnabled } from '../../src/config/config'

describe('getWelshLanguageEnabled', () => {
  it('should return false by default', () => {
    const enabled = getWelshLanguageEnabled()

    expect(enabled).toEqual(false)
  })
})
