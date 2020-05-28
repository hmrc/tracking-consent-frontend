import {
  queryByText,
  getByText,
  fireEvent
} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
// @ts-ignore
import fixture from '../fixtures/servicePageWithBannerMinimal.html'
import renderConfirmationMessage from '../../src/ui/renderConfirmationMessage'

describe('renderConfirmationMessage', () => {
  const youveAcceptedAllMatcher = /You’ve accepted all cookies/

  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = fixture
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
})
