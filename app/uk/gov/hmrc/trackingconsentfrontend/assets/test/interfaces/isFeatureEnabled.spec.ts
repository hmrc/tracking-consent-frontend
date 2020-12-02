import Cookies from 'js-cookie';
import isFeatureEnabled from '../../src/interfaces/isFeatureEnabled';

describe('isFeatureEnabled', () => {
  const { location } = window;
  const testFeatureOne = 'someTestFeature';
  const testFeatureTwo = 'differentTestFeature';

  beforeEach(() => {
    Cookies.remove(testFeatureOne);
    Cookies.remove(testFeatureTwo);
    delete window.location;
  });

  afterAll(() => {
    window.location = location;
  });

  it('should return true if a cookie is set with the featureName and not set on URL', () => {
    window.location = location;
    Cookies.set(testFeatureOne, 'true');
    expect(isFeatureEnabled(testFeatureOne)).toEqual(true);
  });

  it('should return true if a cookie is set with the featureName and also set on URL', () => {
    // @ts-ignore
    window.location = {
      search: `?${testFeatureOne}=true`,
    };
    Cookies.set(testFeatureOne, 'true');
    expect(isFeatureEnabled(testFeatureOne)).toEqual(true);
  });

  it('should return true and set feature cookie if the query string contains featureName=true', () => {
    // @ts-ignore
    window.location = {
      search: `?${testFeatureOne}=true`,
    };
    expect(isFeatureEnabled(testFeatureOne)).toEqual(true);
    expect(Cookies.get(testFeatureOne)).toEqual('true');
  });

  it('should return true and set feature cookie if the query string contain featureName=true and other parameters', () => {
    // @ts-ignore
    window.location = {
      search: `?${testFeatureOne}=true&serviceName=some-service-name`,
    };
    expect(isFeatureEnabled(testFeatureOne)).toEqual(true);
    expect(Cookies.get(testFeatureOne)).toEqual('true');
  });

  it('should return false and not set feature cookie if the query string does not contain featureName=true', () => {
    // @ts-ignore
    window.location = {
      search: `?${testFeatureTwo}=true`,
    };
    expect(isFeatureEnabled(testFeatureOne)).toEqual(false);
    expect(Cookies.get().toBeUndefined);
  });

  it('should return false if the query string feature equal to anything not true', () => {
    // @ts-ignore
    window.location = {
      search: `?${testFeatureOne}=false`,
    };
    expect(isFeatureEnabled(testFeatureOne)).toEqual(false);
    expect(Cookies.get().toBeUndefined);
  });

  it('should return false if the query string is empty', () => {
    // @ts-ignore
    window.location = {
      search: '',
    };
    expect(isFeatureEnabled(testFeatureOne)).toEqual(false);
    expect(Cookies.get().toBeUndefined);
  });
});
