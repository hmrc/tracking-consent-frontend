/* global spyOn */
import {
  getByText, queryByText, queryAllByText, getByRole,
} from '@testing-library/dom';
import renderSettingsSaveConfirmationMessage from '../../src/ui/renderSettingsSaveConfirmationMessage';
// @ts-ignore
import fixture from '../fixtures/settingsFormMinimal.html';
import * as scrollToTop from '../../src/common/scrollToTop';
import * as getReferrer from '../../src/common/getReferrer';
import * as getPathname from '../../src/common/getPathname';
import * as getMessages from '../../src/interfaces/getMessages';

describe('renderSettingsSaveConfirmationMessage', () => {
  let referrer = '/another-service?abc=def&ghi=jkl';

  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = fixture;
    spyOn(scrollToTop, 'default');
    spyOn(getReferrer, 'default').and.callFake(() => referrer);
    spyOn(getPathname, 'default').and.callFake(() => '/tracking-consent/cookie-settings');
  });

  it('should render the save confirmation', () => {
    renderSettingsSaveConfirmationMessage();

    expect(queryByText(document.body, /Your cookie settings were saved/)).toBeTruthy();
  });

  it('should retrieve the save confirmation messages from the passed in messages', () => {
    spyOn(getMessages, 'default').and.returnValue({ 'cookieSettings.saveConfirmation.title': 'Some test title' });
    renderSettingsSaveConfirmationMessage();

    expect(queryByText(document.body, /Some test title/)).toBeTruthy();
  });

  it('should not render a second banner if called multiple times', () => {
    renderSettingsSaveConfirmationMessage();
    renderSettingsSaveConfirmationMessage();

    expect(queryAllByText(document.body, /Your cookie settings were saved/).length).toEqual(1);
  });

  it('should call the scrollToTop helper function', () => {
    renderSettingsSaveConfirmationMessage();

    expect(scrollToTop.default).toHaveBeenCalledTimes(1);
  });

  it('should scroll to top twice if called two times', () => {
    renderSettingsSaveConfirmationMessage();
    renderSettingsSaveConfirmationMessage();

    expect(scrollToTop.default).toHaveBeenCalledTimes(2);
  });

  it('should set the link to the document referrer', () => {
    renderSettingsSaveConfirmationMessage();

    // @ts-ignore
    const backLink: HTMLAnchorElement = getByText(document.body, /Go back to the page you were looking at/);
    expect(backLink.href).toEqual('https://www.tax.service.example.com/another-service?abc=def&ghi=jkl');
  });

  it('should render the link inside a paragraph element', () => {
    renderSettingsSaveConfirmationMessage();

    // @ts-ignore
    const link = getByText(document.body, /Go back to the page you were looking at/);

    const container = link.parentElement;
    expect(container).not.toEqual(null);
    // @ts-ignore
    expect(container.tagName).toEqual('P');
    // @ts-ignore
    expect(container.classList).toContain('govuk-body');
  });

  it('should render the link inside the notice element', () => {
    renderSettingsSaveConfirmationMessage();

    // @ts-ignore
    const link = getByText(document.body, /Go back to the page you were looking at/);

    // @ts-ignore
    const container = link.parentElement.parentElement.parentElement;
    expect(container).not.toEqual(null);
    // @ts-ignore
    expect(container.classList).toContain('cookie-settings__notice');
  });

  it('should not render the referrer link if not set (to be consistent with Gov.UK implementation)', () => {
    referrer = '';
    renderSettingsSaveConfirmationMessage();

    expect(queryAllByText(document.body, /Go back to the page you were looking at/).length).toEqual(0);
  });

  it('should not render the referrer link if it is the same as the settings page (to be consistent with Gov.UK implementation)', () => {
    referrer = '/tracking-consent/cookie-settings';

    renderSettingsSaveConfirmationMessage();

    expect(queryAllByText(document.body, /Go back to the page you were looking at/).length).toEqual(0);
  });

  it('should have tabindex of -1 so it\'s programmatically focusable for screenreader purposes', () => {
    renderSettingsSaveConfirmationMessage();

    // @ts-ignore
    const confirmationMessage = getByText(document.body, /Your cookie settings were saved/).parentNode.parentNode.parentNode;

    // @ts-ignore
    expect(confirmationMessage.tabIndex).toEqual(-1);
  });

  it('should have the correct role and label', () => {
    renderSettingsSaveConfirmationMessage();

    expect(getByRole(document.body, 'alertdialog')).toBeTruthy();
  });

  it('should have the focus after it is rendered', () => {
    renderSettingsSaveConfirmationMessage();

    // @ts-ignore
    const confirmationMessage = getByText(document.body, /Your cookie settings were saved/).parentNode.parentNode;

    expect(document.activeElement).toEqual(confirmationMessage);
  });
});
