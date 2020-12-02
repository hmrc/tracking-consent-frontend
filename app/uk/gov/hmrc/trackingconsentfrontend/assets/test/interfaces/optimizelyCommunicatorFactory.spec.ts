import optimizelyCommunicatorFactory from '../../src/interfaces/optimizelyCommunicatorFactory';

describe('sendPreferences', () => {
  let testScope;
  beforeEach(() => {
    testScope = { window: {} };
    testScope.preferenceCommunicator = optimizelyCommunicatorFactory(testScope.window);
    testScope.userPreferences = { getPreferences: jest.fn() };
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: false,
      marketing: false,
      settings: false,
    });
  });

  it('should set optOut to true when measurement is set to false', () => {
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);
    expect(testScope.window.optimizely).toEqual([
      { type: 'optOut', isOptOut: true },
    ]);
  });

  it('should set optOut to false when measurement setting is set to true', () => {
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: true,
      marketing: false,
      settings: false,
    });
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);
    expect(testScope.window.optimizely).toEqual([
      { type: 'optOut', isOptOut: false },
    ]);
  });

  it('should add to existing optimizely array where it already exists', () => {
    testScope.window.optimizely = [{ event: 'some-prior-event' }];
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);
    expect(testScope.window.optimizely).toEqual([
      { event: 'some-prior-event' },
      { type: 'optOut', isOptOut: true },
    ]);
  });

  it('should not replace the existing Optimizely array when adding events', () => {
    testScope.window.optimizely = [];
    const originalOptimizely = testScope.window.optimizely;
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);
    expect(testScope.window.optimizely).toStrictEqual(originalOptimizely);
  });

  it('should ignore any measurement values which are not boolean true', () => {
    testScope.userPreferences.getPreferences.mockReturnValue({
      measurement: 'yes',
      marketing: 'no',
      settings: 'maybe',
    });
    testScope.preferenceCommunicator.sendPreferences((testScope.userPreferences));
    expect(testScope.window.optimizely).toEqual([
      { type: 'optOut', isOptOut: true },
    ]);
  });

  it('should set opt out to true when no preferences are stored', () => {
    testScope.userPreferences.getPreferences.mockReturnValue(undefined);
    testScope.preferenceCommunicator.sendPreferences(testScope.userPreferences);

    expect(testScope.window.optimizely).toEqual([
      { type: 'optOut', isOptOut: true },
    ]);
  });
});
