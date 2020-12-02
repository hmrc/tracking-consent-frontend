/* global spyOn */
import {
  fireEvent, getByRole, getByText, queryByText,
} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
import renderBanner from '../../src/ui/renderBanner';
// @ts-ignore
import fixture from '../fixtures/servicePage.html';
// @ts-ignore
import fixtureFrontendToolkit from '../fixtures/servicePageFrontendToolkit.html';
// @ts-ignore
import fixtureClassic from '../fixtures/servicePageClassic.html';
import * as getLanguage from '../../src/interfaces/getLanguage';
import * as isFeatureEnabled from '../../src/interfaces/isFeatureEnabled';
import * as getTrackingConsentBaseUrl from '../../src/common/getTrackingConsentBaseUrl';

describe('renderBanner', () => {
  const userAcceptsAll = jest.fn();
  const getPreferences = jest.fn();
  const setPreferences = jest.fn();
  const getUserHasSavedCookiePreferences = jest.fn();
  const sendPreferences = jest.fn();
  const subscribe = jest.fn();
  const userPreference = {
    userAcceptsAll,
    getPreferences,
    setPreferences,
    getUserHasSavedCookiePreferences,
    sendPreferences,
    subscribe,
  };
  const preferenceCommunicator = {
    sendPreferences,
  };

  const tellUsYouAcceptAllMatcher = /Tell us whether you accept cookies/;
  const youveAcceptedAllMatcher = /You’ve accepted all cookies/;

  const assume = expect;

  let languageSpy;
  let featureEnabledSpy;
  let getTrackingConsentBaseUrlSpy;

  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = fixture;
    userPreference.getUserHasSavedCookiePreferences.mockReturnValue(false);
    userAcceptsAll.mockReset();
    preferenceCommunicator.sendPreferences.mockReset();
    languageSpy = spyOn(getLanguage, 'default').and.returnValue('en');
    featureEnabledSpy = spyOn(isFeatureEnabled, 'default').and.returnValue(true);
    getTrackingConsentBaseUrlSpy = spyOn(getTrackingConsentBaseUrl, 'default').and.returnValue('https://my-example.com:1234');
  });

  const clickAcceptAll = () => {
    // getByText will fail the test if the text is not found
    // Finding elements by text makes the tests similar to how a user would interact with the page
    fireEvent.click(getByText(document.body, 'Accept all cookies'));
  };

  it('should render a banner', () => {
    renderBanner(userPreference);

    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeTruthy();
  });

  xit('should render the Welsh version of the banner', () => {
    languageSpy.and.returnValue('cy');

    renderBanner(userPreference);

    expect(queryByText(document.body, /Lorem ipsum/)).toBeTruthy();
  });

  it('should render a submit button', () => {
    renderBanner(userPreference);

    const button = queryByText(document.body, 'Accept all cookies');
    expect(button).toBeTruthy();
    // @ts-ignore
    expect(button.getAttribute('type')).toEqual('submit');
  });

  it('should render a cookie settings button', () => {
    renderBanner(userPreference);

    const button = queryByText(document.body, 'Set cookie preferences');
    expect(button).toBeTruthy();
    // @ts-ignore
    expect(button.getAttribute('href')).toEqual('https://my-example.com:1234/tracking-consent/cookie-settings');
  });
  it('should render a cookie settings button based on base URL', () => {
    getTrackingConsentBaseUrlSpy.and.returnValue('http://localhost:8000');
    renderBanner(userPreference);

    const button = queryByText(document.body, 'Set cookie preferences');
    expect(button).toBeTruthy();
    // @ts-ignore
    expect(button.getAttribute('href')).toEqual('http://localhost:8000/tracking-consent/cookie-settings');
  });

  it('should render a cookie settings link based on base URL', () => {
    getTrackingConsentBaseUrlSpy.and.returnValue('http://localhost:8000');
    renderBanner(userPreference);

    const link = queryByText(document.body, 'cookies to collect information');
    expect(link).toBeTruthy();
    // @ts-ignore
    expect(link.getAttribute('href')).toEqual('http://localhost:8000/tracking-consent/cookie-settings');
  });

  it('should render the banner after the govuk-frontend skiplink link', () => {
    renderBanner(userPreference);

    const skipLink = document.querySelector('.govuk-skip-link');

    // @ts-ignore
    expect(skipLink.nextSibling.classList).toContain('cbanner-cookie-banner');
  });

  it('should render the banner after the govuk toolkit skiplink container', () => {
    document.getElementsByTagName('html')[0].innerHTML = fixtureFrontendToolkit;
    renderBanner(userPreference);

    const skipLink = document.querySelector('#skiplink-container');

    // @ts-ignore
    expect(skipLink.nextSibling.classList).toContain('cbanner-cookie-banner');
  });

  it('should render the banner at the top of the body element if no skiplink tag exists', () => {
    document.getElementsByTagName('html')[0].innerHTML = fixtureClassic;

    renderBanner(userPreference);

    // @ts-ignore
    expect(document.body.firstChild.classList).toContain('cbanner-cookie-banner');
  });

  it('should render a role and aria-label attribute for the cookie banner', () => {
    document.getElementsByTagName('html')[0].innerHTML = fixtureClassic;

    renderBanner(userPreference);

    expect(getByRole(document.body, 'region', { name: 'Cookie Banner' })).toBeTruthy();
  });

  it('should call preference manager when user accepts', () => {
    renderBanner(userPreference);
    assume(userAcceptsAll).not.toHaveBeenCalled();

    clickAcceptAll();

    expect(userAcceptsAll).toHaveBeenCalledWith();
  });

  it('should show a save confirmation when user accepts', () => {
    renderBanner(userPreference);
    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeFalsy();

    clickAcceptAll();

    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeTruthy();
  });

  it('should hide the accept all question when user accepts', () => {
    renderBanner(userPreference);
    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeTruthy();

    clickAcceptAll();

    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeFalsy();
  });

  it('should not render a banner if the cookie has been set', () => {
    userPreference.getUserHasSavedCookiePreferences.mockReturnValue(true);
    renderBanner(userPreference);

    expect(queryByText(document.body, /Tell us whether you accept cookies/)).not.toBeTruthy();
  });

  it('should render the banner if the feature enableTrackingConsent is enabled', () => {
    featureEnabledSpy.and.returnValue(true);
    renderBanner(userPreference);

    expect(queryByText(document.body, /Tell us whether you accept cookies/)).toBeTruthy();
  });

  it('should remove the old cookie banner when user preferences have not been set', () => {
    userPreference.getUserHasSavedCookiePreferences.mockReturnValue(false);
    document.getElementsByTagName('html')[0].innerHTML = fixtureFrontendToolkit;
    expect(queryByText(document.body, /GOV.UK uses cookies to make the site simpler/)).toBeTruthy();

    renderBanner(userPreference);

    expect(queryByText(document.body, /GOV.UK uses cookies to make the site simpler/)).toBeFalsy();
  });

  it('should remove the old cookie banner when user preferences have been set', () => {
    userPreference.getUserHasSavedCookiePreferences.mockReturnValue(true);
    document.getElementsByTagName('html')[0].innerHTML = fixtureFrontendToolkit;
    expect(queryByText(document.body, /GOV.UK uses cookies to make the site simpler/)).toBeTruthy();

    renderBanner(userPreference);

    expect(queryByText(document.body, /GOV.UK uses cookies to make the site simpler/)).toBeFalsy();
  });

  describe('Meta tests', () => {
    it('should reset state between tests', () => {
      expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeFalsy();
    });
  });
});
