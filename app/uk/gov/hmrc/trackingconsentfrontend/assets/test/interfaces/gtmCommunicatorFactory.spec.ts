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
  it('should send measurement, marketing and settings when all tracking is allowed', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      marketing: true,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-measurement-allowed' },
      { event: 'hmrc-marketing-allowed' },
      { event: 'hmrc-settings-allowed' },
    ]);
  });
  it('should add to existing datalayer where it already exists', () => {
    testScope.window.dataLayer = [{ event: 'my-custom-event' }];
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      marketing: true,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { event: 'my-custom-event' },
      { event: 'hmrc-measurement-allowed' },
      { event: 'hmrc-marketing-allowed' },
      { event: 'hmrc-settings-allowed' },
    ]);
  });
  it('should send only measurement when the others are false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      marketing: false,
      settings: false,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-measurement-allowed' },
    ]);
  });
  it('should send only marketing when the others are false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: false,
      marketing: true,
      settings: false,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-marketing-allowed' },
    ]);
  });
  it('should send only settings when the others are false', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: false,
      marketing: false,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-settings-allowed' },
    ]);
  });
  it('should not replace the existing datalayer where it exists', () => {
    testScope.window.dataLayer = [];
    const originalDataLayer = testScope.window.dataLayer;
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      marketing: true,
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
    ]);
  });
  it('should ignore any marketing and settings values which are not boolean true', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: true,
      marketing: 'yes please',
      settings: 'sure, why not',
    });
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences));

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-measurement-allowed' },
    ]);
  });
  it('should ignore measurement values which are not boolean true', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue({
      measurement: 'yes please',
      marketing: true,
      settings: true,
    });
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences));

    expect(testScope.window.dataLayer).toEqual([
      { event: 'hmrc-marketing-allowed' },
      { event: 'hmrc-settings-allowed' },
    ]);
  });
  it('should fire no events when no preferences are stored', () => {
    spyOn(testScope.userPreferences, 'getPreferences').and.returnValue(undefined);
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences));

    expect(testScope.window.dataLayer).toEqual([]);
  });
});
