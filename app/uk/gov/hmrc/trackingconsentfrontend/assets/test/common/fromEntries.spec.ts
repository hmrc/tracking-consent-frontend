import fromEntries from "../../src/common/fromEntries";

describe('fromEntries', () => {
  it('should convert an array of key value pairs to an object', () => {
    const entries: [string, number][] = [['a', 1], ['b', 2]]

    const object = fromEntries(entries)

    expect(object).toEqual({ a: 1, b: 2 })
  })

  it('should convert an empty array to an empty object', () => {
    const entries: [string, number][] = []

    const object = fromEntries(entries)

    expect(object).toEqual({})
  })
})
