/* global spyOn */
import { JSDOM } from 'jsdom';
import * as enableGtm from '../../src/interfaces/enableGtm';
import pageHandler from '../../src/common/pageHandler';
import userPreferencesFactory from '../../src/domain/userPreferencesFactory';
import * as isFeatureEnabled from '../../src/interfaces/isFeatureEnabled';
import * as getGtmContainer from '../../src/common/getGtmContainerId';
import { SERVICE_PAGE_LOAD_EVENT } from '../../src/constants/events';
import clearAllMocks = jest.clearAllMocks;

describe('pageHandler', () => {
  const pageRenderer = jest.fn();
  let thisDocument;
  let testScope;
  let featureEnabledSpy;
  let getGtmContainerSpy;

  const pageLoad = () => {
    const event = thisDocument.createEvent('HTMLEvents');
    event.initEvent('DOMContentLoaded', true, true);
    thisDocument.dispatchEvent(event);
  };

  beforeEach(() => {
    // create a new Document on each test so event listeners are not added
    // multiple times
    const dom = new JSDOM('<html></html>');
    testScope = {
      document,
      window,
      userPreferences: userPreferencesFactory(),
    };
    thisDocument = dom.window.document;
    spyOn(enableGtm, 'default');
    spyOn(testScope.userPreferences, 'sendPreferences').and.returnValue(undefined);
    clearAllMocks();
    featureEnabledSpy = spyOn(isFeatureEnabled, 'default').and.returnValue(true);
    getGtmContainerSpy = spyOn(getGtmContainer, 'default').and.returnValue('GTM-CONTAINER-ID');
  });

  it('should enable GTM', () => {
    expect(enableGtm.default).not.toHaveBeenCalled();

    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);

    expect(enableGtm.default).toHaveBeenCalledTimes(1);
    expect(enableGtm.default).toHaveBeenCalledWith('GTM-CONTAINER-ID');
  });

  it('should throw an error if no gtm attribute is set', () => {
    expect(enableGtm.default).not.toHaveBeenCalled();
    getGtmContainerSpy.and.returnValue(undefined);

    expect(() => pageHandler(thisDocument, testScope.userPreferences, pageRenderer)).toThrow('container id not specified in data-gtm-container attribute. The previous default container ID was removed on 03 November 2020');
  });

  it('should enable GTM with a different container id', () => {
    getGtmContainerSpy.and.returnValue('GTM-TEST');
    expect(enableGtm.default).not.toHaveBeenCalled();

    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);

    expect(enableGtm.default).toHaveBeenCalledTimes(1);
    expect(enableGtm.default).toHaveBeenCalledWith('GTM-TEST');
  });

  it('should send the preferences', () => {
    expect(testScope.userPreferences.sendPreferences).not.toHaveBeenCalled();

    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);

    expect(testScope.userPreferences.sendPreferences).toHaveBeenCalledTimes(1);
    expect(testScope.userPreferences.sendPreferences).toHaveBeenCalledWith(SERVICE_PAGE_LOAD_EVENT);
  });

  it('should call not call the page renderer if the DOM ContentReady event has not been fired', () => {
    // @ts-ignore
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);

    expect(pageRenderer).not.toHaveBeenCalled();
  });

  it('should call the page renderer', () => {
    expect(pageRenderer).not.toHaveBeenCalled();

    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);
    pageLoad();

    expect(pageRenderer).toHaveBeenCalledTimes(1);
  });

  it('should pass through userPreference to pageRenderer', () => {
    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);
    pageLoad();

    expect(pageRenderer).toHaveBeenCalledWith(testScope.userPreferences);
  });

  it('should not call the page renderer if the feature toggle is toggled off', () => {
    featureEnabledSpy.and.returnValue(false);
    expect(pageRenderer).not.toHaveBeenCalled();

    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);
    pageLoad();

    expect(pageRenderer).not.toHaveBeenCalled();
  });
});
