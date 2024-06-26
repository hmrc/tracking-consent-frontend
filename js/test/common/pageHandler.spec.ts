/* global spyOn */
import { JSDOM } from 'jsdom';
import * as enableGtm from '../../src/interfaces/enableGtm';
import pageHandler from '../../src/common/pageHandler';
import userPreferencesFactory from '../../src/domain/userPreferencesFactory';
import * as getGtmContainer from '../../src/common/getGtmContainerId';
import { SERVICE_PAGE_LOAD_EVENT } from '../../src/constants/events';
import clearAllMocks = jest.clearAllMocks;

describe('pageHandler', () => {
  const pageRenderer = jest.fn();
  let thisDocument;
  let testScope;
  let getGtmContainerSpy;
  let functionCalls;

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
    functionCalls = [];
    jest.spyOn(enableGtm, 'default').mockImplementation(() => {
      functionCalls.push('enableGtm');
    });
    jest.spyOn(testScope.userPreferences, 'sendPreferences').mockImplementation(() => {
      functionCalls.push('sendPreferences');
      return undefined;
    });
    clearAllMocks();
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

  it('should make the userPreferences object available in the window', () => {
    // @ts-ignore
    delete window.trackingConsent;

    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);

    expect(window.trackingConsent).toBeDefined();
    expect(window.trackingConsent.userPreferences).toBeDefined();
    expect(window.trackingConsent.userPreferences).toEqual(testScope.userPreferences);
  });

  // See: https://developers.google.com/tag-manager/devguide#adding-data-layer-variables-to-a-page
  it('should send the preferences before GTM is enabled', () => {
    expect(testScope.userPreferences.sendPreferences).not.toHaveBeenCalled();

    pageHandler(thisDocument, testScope.userPreferences, pageRenderer);

    expect(functionCalls).toEqual([
      'sendPreferences', 'enableGtm',
    ]);
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
});
