/* global spyOn */

import {
  queryByText,
  getByText,
  fireEvent
} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import renderBanner from '../../src/ui/renderBanner'
// @ts-ignore
import fixture from '../fixtures/servicePage.html'
// @ts-ignore
import fixtureFrontendToolkit from '../fixtures/servicePageFrontendToolkit.html'
// @ts-ignore
import fixtureClassic from '../fixtures/servicePageClassic.html'

describe('renderBanner', () => {

  const userAcceptsAll = jest.fn()
  const getUserHasSavedCookiePreferences = jest.fn()
  const userPreference = {
    userAcceptsAll,
    getUserHasSavedCookiePreferences
  }

  const tellUsYouAcceptAllMatcher = /Tell us whether you accept cookies/
  const youveAcceptedAllMatcher = /You’ve accepted all cookies/

  const reset = () => {
    document.getElementsByTagName('html')[0].innerHTML = fixture
    userPreference.getUserHasSavedCookiePreferences.mockReturnValue(false)
  }

  const assume = expect

  beforeAll(reset)
  afterEach(reset)

  const clickAcceptAll = () => {
    // getByText will fail the test if the text is not found
    // Finding elements by text makes the tests similar to how a user would interact with the page
    fireEvent.click(getByText(document.body, 'Accept all cookies'))
  }

  const clickHide = () => {
    fireEvent.click(getByText(document.body, 'Hide'))
  }

  it('should render a banner', () => {
    renderBanner(userPreference)

    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeTruthy()
  })

  it('should render the banner after the govuk-frontend skiplink link', () => {
    renderBanner(userPreference)

    const skipLink = document.querySelector('.govuk-skip-link')

    // @ts-ignore
    expect(skipLink.nextSibling.classList).toContain('cookie-banner')
  })

  it('should render the banner after the govuk toolkit skiplink container', () => {
    document.getElementsByTagName('html')[0].innerHTML = fixtureFrontendToolkit
    renderBanner(userPreference)

    const skipLink = document.querySelector('#skiplink-container')

    // @ts-ignore
    expect(skipLink.nextSibling.classList).toContain('cookie-banner')
  })

  it('should render the banner at the top of the body element if no skiplink tag exists', () => {
    document.getElementsByTagName('html')[0].innerHTML = fixtureClassic

    renderBanner(userPreference)

    // @ts-ignore
    expect(document.body.firstChild.classList).toContain('cookie-banner')
  })

  it('should call preference manager when user accepts', () => {
    renderBanner(userPreference)
    assume(userAcceptsAll).not.toHaveBeenCalled()

    clickAcceptAll()

    expect(userAcceptsAll).toHaveBeenCalledWith()
  })

  it('should show a save confirmation when user accepts', () => {
    renderBanner(userPreference)
    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeFalsy()

    clickAcceptAll()

    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeTruthy()
  })

  it('should hide the accept all question when user accepts', () => {
    renderBanner(userPreference)
    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeTruthy()

    clickAcceptAll()

    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeFalsy()
  })

  it('should hide the confirmation message when user clicks hide', () => {
    renderBanner(userPreference)
    clickAcceptAll()
    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeFalsy()
    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeTruthy()

    clickHide()

    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeFalsy()
    expect(queryByText(document.body, youveAcceptedAllMatcher)).toBeFalsy()
  })

  it('should not render a banner if the cookie has been set', () => {
    userPreference.getUserHasSavedCookiePreferences.mockReturnValue( true)
    renderBanner(userPreference)

    expect(queryByText(document.body, /Tell us whether you accept cookies/)).not.toBeTruthy()
  })

  describe('Meta tests', () => {
    it('should reset state between tests', () => {
      expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeFalsy()
    })
  })
})
