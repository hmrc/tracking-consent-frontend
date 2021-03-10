/* global spyOn */
import gtmCommunicatorFactory from '../../src/interfaces/gtmCommunicatorFactory';
import userPreferencesFactory from '../../src/domain/userPreferencesFactory';

describe('sendPreferences', () => {
  let testScope;
  beforeEach(() => {
    testScope = { window: {} };
    testScope.preferenceCommunicator = gtmCommunicatorFactory(testScope.window);
    testScope.userPreferences = userPreferencesFactory();
    testScope.userPreferences.subscribe(testScope.preferenceCommunicator);
  });
  it('should send measurement, settings when all tracking is allowed', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toContainEqual(
      { event: 'hmrc-measurement-allowed' },
    );
    expect(testScope.window.dataLayer).toContainEqual(
      { event: 'hmrc-settings-allowed' },
    );
  });

  it('should set a measurement and settings datalayer variable when all tracking is allowed', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer.find((dataLayerEntry) => dataLayerEntry['tracking-consent-measurement-allowed'] === true)).toBeDefined();
    expect(testScope.window.dataLayer.find((dataLayerEntry) => dataLayerEntry['tracking-consent-settings-allowed'] === true)).toBeDefined();
  });

  it('should set a measurement and settings datalayer variable set to false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: false,
      settings: false,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer.find((dataLayerEntry) => dataLayerEntry['tracking-consent-measurement-allowed'] === false)).toBeDefined();
    expect(testScope.window.dataLayer.find((dataLayerEntry) => dataLayerEntry['tracking-consent-settings-allowed'] === false)).toBeDefined();
  });

  it('should add to existing datalayer where it already exists', () => {
    testScope.window.dataLayer = [{ event: 'my-custom-event' }];
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { event: 'my-custom-event' },
      { event: 'hmrc-measurement-allowed' },
      { 'tracking-consent-measurement-allowed': true },
      { event: 'hmrc-settings-allowed' },
      { 'tracking-consent-settings-allowed': true },
    ]);
  });

  it('should send only measurement when the others are false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      settings: false,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-measurement-allowed' },
      { 'tracking-consent-measurement-allowed': true },
      { 'tracking-consent-settings-allowed': false },
    ]);
  });

  it('should send only settings when the others are false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: false,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { 'tracking-consent-measurement-allowed': false },
      { event: 'hmrc-settings-allowed' },
      { 'tracking-consent-settings-allowed': true },
    ]);
  });

  it('should not replace the existing datalayer where it exists', () => {
    testScope.window.dataLayer = [];
    const originalDataLayer = testScope.window.dataLayer;
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences));
    expect(testScope.window.dataLayer).toStrictEqual(originalDataLayer);
  });
  it('should ignore any keys that are unknown', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      co1234mmunication: true,
      set1234tings: true,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-measurement-allowed' },
      { 'tracking-consent-measurement-allowed': true },
      { 'tracking-consent-settings-allowed': false },
    ]);
  });

  it('should ignore settings values which are not boolean true', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      settings: 'sure, why not',
    });
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences));

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-measurement-allowed' },
      { 'tracking-consent-measurement-allowed': true },
      { 'tracking-consent-settings-allowed': false },
    ]);
  });
  it('should ignore measurement values which are not boolean true', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: 'yes please',
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences));

    expect(testScope.window.dataLayer).toEqual([
      { 'tracking-consent-measurement-allowed': false },
      { event: 'hmrc-settings-allowed' },
      { 'tracking-consent-settings-allowed': true },
    ]);
  });

  it('should fire no events when no preferences are stored', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue(undefined);
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences));

    expect(testScope.window.dataLayer).toEqual([
      { 'tracking-consent-measurement-allowed': false },
      { 'tracking-consent-settings-allowed': false },
    ]);
  });
});
