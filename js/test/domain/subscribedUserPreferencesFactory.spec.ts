/* global spyOn */
import subscribedUserPreferencesFactory from '../../src/domain/subscribedUserPreferencesFactory';
import * as userPreferencesFactory from '../../src/domain/userPreferencesFactory';
import * as gtmCommunicatorFactory from '../../src/interfaces/gtmCommunicatorFactory';
import * as optimizelyCommunicatorFactory from '../../src/interfaces/optimizelyCommunicatorFactory';

describe('subscribedUserPreferencesFactory', () => {
  let testScope;
  beforeEach(() => {
    testScope = { window: {} };
    testScope.userPreference = { subscribe: jest.fn() };
    testScope.stubCommunicatorOne = () => ({});
    testScope.stubCommunicatorTwo = () => ({});
    spyOn(gtmCommunicatorFactory, 'default').and.returnValue(testScope.stubCommunicatorOne);
    spyOn(optimizelyCommunicatorFactory, 'default').and.returnValue(testScope.stubCommunicatorTwo);
    spyOn(userPreferencesFactory, 'default').and.returnValue(testScope.userPreference);
  });

  it('should create communicators for gtm and Optimizely', () => {
    subscribedUserPreferencesFactory(testScope.window);
    expect(gtmCommunicatorFactory.default).toHaveBeenCalledTimes(1);
    expect(optimizelyCommunicatorFactory.default).toHaveBeenCalledTimes(1);
  });

  it('should subscribe user preferences for gtm and Optimizely', () => {
    subscribedUserPreferencesFactory(testScope.window);
    expect(testScope.userPreference.subscribe).toHaveBeenCalledWith(testScope.stubCommunicatorOne);
    expect(testScope.userPreference.subscribe).toHaveBeenCalledWith(testScope.stubCommunicatorTwo);
  });
});
