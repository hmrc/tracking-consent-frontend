import isFeatureEnabled from '../../src/interfaces/isFeatureEnabled'

describe('isFeatureEnabled', () => {
  const { location } = window

  beforeEach(() => {
    delete window.location
  })

  afterAll(() => {
    window.location = location
  })

  it('should return true if the query string contains featureName=true', () => {
    // @ts-ignore
    window.location = {
      search: '?someTestFeature=true'
    }
    expect(isFeatureEnabled('someTestFeature')).toEqual(true)
  })

  it('should return true if the query string contain featureName=true and other parameters', () => {
    // @ts-ignore
    window.location = {
      search: '?someTestFeature=true&serviceName=some-service-name'
    }
    expect(isFeatureEnabled('someTestFeature')).toEqual(true)
  })

  it('should return false if the query string does not contain featureName=true', () => {
    // @ts-ignore
    window.location = {
      search: '?differentTestFeature=true'
    }
    expect(isFeatureEnabled('someTestFeature')).toEqual(false)
  })

  it('should return false if the query string contains featureName=false', () => {
    // @ts-ignore
    window.location = {
      search: '?someTestFeature=false'
    }
    expect(isFeatureEnabled('someTestFeature')).toEqual(false)
  })

  it('should return false if the query string is empty', () => {
    // @ts-ignore
    window.location = {
      search: ''
    }
    expect(isFeatureEnabled('someTestFeature')).toEqual(false)
  })
})
