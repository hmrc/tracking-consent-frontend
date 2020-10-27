/* global spyOn */
import {
  queryByText,
  getByText,
  fireEvent
} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
// @ts-ignore
import fixture from '../fixtures/servicePageWithBannerMinimal.html'
import renderConfirmationMessage from '../../src/ui/renderConfirmationMessage'
import * as getTrackingConsentBaseUrl from '../../src/common/getTrackingConsentBaseUrl'

describe('renderConfirmationMessage', () => {
  const youveAcceptedAllMatcher = /You’ve accepted all cookies/
  let getTrackingConsentBaseUrlSpy

  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = fixture
    getTrackingConsentBaseUrlSpy = spyOn(getTrackingConsentBaseUrl, 'default').and.returnValue('http://localhost:12345')
  })

  const clickHide = () => {
    fireEvent.click(getByText(document.body, 'Hide'))
  }

  it('should show a save confirmation', () => {
    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeFalsy()

    renderConfirmationMessage()

    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeTruthy()
  })

  it('should hide the confirmation message when user clicks hide', () => {
    renderConfirmationMessage()
    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeTruthy()

    clickHide()

    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeFalsy()
  })

  it('should have a tabindex of -1 so it is programmatically focusable (for screen reader purposes)', () => {
    renderConfirmationMessage()

    // @ts-ignore
    const confirmationMessage = getByText(document.body, /You’ve accepted all cookies/).parentNode

    // @ts-ignore
    expect(confirmationMessage.tabIndex).toEqual(-1)
  })

  it('should have the govuk-width-container class', () => {
    renderConfirmationMessage()

    // @ts-ignore
    const confirmationMessage = getByText(document.body, /You’ve accepted all cookies/).parentNode

    // @ts-ignore
    expect(confirmationMessage.classList).toContain('cbanner-govuk-width-container')
  })

  it('should have the focus after it is rendered', () => {
    renderConfirmationMessage()

    // @ts-ignore
    const confirmationMessage = getByText(document.body, /You’ve accepted all cookies/).parentNode

    expect(document.activeElement).toEqual(confirmationMessage)
  })

  it('should render a cookie settings link with a local url if running locally', () => {
    renderConfirmationMessage()

    const button = queryByText(document.body, /change your cookie settings/)
    // @ts-ignore
    expect(button.getAttribute('href')).toEqual('http://localhost:12345/tracking-consent/cookie-settings')
  })

  it('should render a cookie settings link with a local url if running in production', () => {
    getTrackingConsentBaseUrlSpy.and.returnValue('https://www.tax.service.gov.uk')
    renderConfirmationMessage()

    const button = queryByText(document.body, /change your cookie settings/)
    // @ts-ignore
    expect(button.getAttribute('href')).toEqual('https://www.tax.service.gov.uk/tracking-consent/cookie-settings')
  })
})
