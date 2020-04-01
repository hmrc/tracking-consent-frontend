/* global jasmine, spyOn */
import preferenceCommunicatorFactory from "../../src/interfaces/preferenceCommunicatorFactory";
import userPreferenceFactory from "../../src/domain/userPreferenceFactory";

describe('sendPreferences', () => {
  let testScope
  beforeEach(() => {
    testScope = {window: {}}
    testScope.preferenceCommunicator = preferenceCommunicatorFactory(testScope.window)
    testScope.userPreferences = userPreferenceFactory({})
  })
  it('should send usage, campaigns and settings when all tracking is allowed', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: true,
      campaigns: true,
      settings: true
    })
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)

    expect(testScope.window.dataLayer).toEqual([
      {event: 'hmrc-usage-allowed'},
      {event: 'hmrc-campaigns-allowed'},
      {event: 'hmrc-settings-allowed'}
    ])
  })
  it('should add to existing datalayer where it already exists', () => {
    testScope.window.dataLayer = [{event: 'my-custom-event'}]
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: true,
      campaigns: true,
      settings: true
    })
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)

    expect(testScope.window.dataLayer).toEqual([
      {event: 'my-custom-event'},
      {event: 'hmrc-usage-allowed'},
      {event: 'hmrc-campaigns-allowed'},
      {event: 'hmrc-settings-allowed'}
    ])
  })
  it('should send only usage when the others are false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: true,
      campaigns: false,
      settings: false
    })
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)

    expect(testScope.window.dataLayer).toEqual([
      {event: 'hmrc-usage-allowed'},
    ])
  })
  it('should send only campaigns when the others are false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: false,
      campaigns: true,
      settings: false
    })
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)

    expect(testScope.window.dataLayer).toEqual([
      {event: 'hmrc-campaigns-allowed'},
    ])
  })
  it('should send only settings when the others are false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: false,
      campaigns: false,
      settings: true
    })
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)

    expect(testScope.window.dataLayer).toEqual([
      {event: 'hmrc-settings-allowed'},
    ])
  })
  it('should not replace the existing datalayer where it exists', () => {
    const originalDataLayer = testScope.window.dataLayer = []
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: true,
      campaigns: true,
      settings: true
    })
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences))
    expect(testScope.window.dataLayer).toStrictEqual(originalDataLayer)
  })
  it('should ignore any keys that are unknown', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: true,
      co1234mmunication: true,
      set1234tings: true
    })
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences)

    expect(testScope.window.dataLayer).toEqual([
      {event: 'hmrc-usage-allowed'},
    ])
  })
  it('should ignore any campaigns and settings values which are not boolean true', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: true,
      campaigns: "yes please",
      settings: "sure, why not"
    })
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences))

    expect(testScope.window.dataLayer).toEqual([
      {event: 'hmrc-usage-allowed'},
    ])
  })
  it('should ignore usage values which are not boolean true', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      usage: "yes please",
      campaigns: true,
      settings: true
    })
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences))

    expect(testScope.window.dataLayer).toEqual([
      {event: 'hmrc-campaigns-allowed'},
      {event: 'hmrc-settings-allowed'},
    ])
  })
  it('should fire no events when no preferences are stored', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue(undefined)
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences))

    expect(testScope.window.dataLayer).toEqual([])
  })
})
