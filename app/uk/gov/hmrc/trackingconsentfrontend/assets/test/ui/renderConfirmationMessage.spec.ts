/* global spyOn */
import {
  queryByText,
  getByText,
  fireEvent,
} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';
// @ts-ignore
import fixture from '../fixtures/servicePageWithBannerMinimal.html';
import renderConfirmationMessage from '../../src/ui/renderConfirmationMessage';
import * as getTrackingConsentBaseUrl from '../../src/common/getTrackingConsentBaseUrl';

describe('renderConfirmationMessage', () => {
  const youveAcceptedAdditionalMatcher = /You have accepted additional cookies/;
  let getTrackingConsentBaseUrlSpy;

  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = fixture;
    getTrackingConsentBaseUrlSpy = spyOn(getTrackingConsentBaseUrl, 'default').and.returnValue('http://localhost:12345');
  });

  const clickHide = () => {
    fireEvent.click(getByText(document.body, 'Hide this message'));
  };

  it('should show a save confirmation', () => {
    expect(queryByText(document.body, youveAcceptedAdditionalMatcher)).toBeFalsy();

    renderConfirmationMessage('You have accepted additional cookies');

    expect(queryByText(document.body, youveAcceptedAdditionalMatcher)).toBeTruthy();
  });

  it('should hide the confirmation message when user clicks hide', () => {
    renderConfirmationMessage('You have accepted additional cookies');
    expect(queryByText(document.body, youveAcceptedAdditionalMatcher)).toBeTruthy();

    clickHide();

    expect(queryByText(document.body, youveAcceptedAdditionalMatcher)).toBeFalsy();
  });

  it('should have a tabindex of -1 so it is programmatically focusable (for screen reader purposes)', () => {
    renderConfirmationMessage('You have accepted additional cookies');

    // @ts-ignore
    const confirmationMessage = getByText(document.body, /You have accepted additional cookies/).parentNode;

    // @ts-ignore
    expect(confirmationMessage.tabIndex).toEqual(-1);
  });

  it('should have the govuk-width-container class', () => {
    renderConfirmationMessage('You have accepted additional cookies');

    // @ts-ignore
    const confirmationMessage = getByText(document.body, /You have accepted additional cookies/).parentNode.parentNode.parentNode.parentNode;

    // @ts-ignore
    expect(confirmationMessage.classList).toContain('cbanner-govuk-width-container');
  });

  it('should have the focus after it is rendered', () => {
    renderConfirmationMessage('You have accepted additional cookies');

    // @ts-ignore
    const confirmationMessage = getByText(document.body, /You have accepted additional cookies/).parentNode.parentNode.parentNode.parentNode;

    // @ts-ignore
    expect(document.activeElement).toEqual(confirmationMessage);
  });

  it('should render a cookie settings link with a local url if running locally', () => {
    renderConfirmationMessage('You have accepted additional cookies');

    const button = queryByText(document.body, /change your cookie settings/);
    // @ts-ignore
    expect(button.getAttribute('href')).toEqual('http://localhost:12345/tracking-consent/cookie-settings');
  });

  it('should render a cookie settings link with a local url if running in production', () => {
    getTrackingConsentBaseUrlSpy.and.returnValue('https://www.tax.service.gov.uk');
    renderConfirmationMessage('You have accepted additional cookies');

    const button = queryByText(document.body, /change your cookie settings/);
    // @ts-ignore
    expect(button.getAttribute('href')).toEqual('https://www.tax.service.gov.uk/tracking-consent/cookie-settings');
  });
});
