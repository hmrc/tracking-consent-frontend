/* global spyOn */

import {
  queryByText,
  getByText,
  fireEvent
} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import renderBanner from '../../src/ui/renderBanner'

describe('renderBanner', () => {
  const reset = () => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  }

  const assume = expect

  beforeAll(reset)
  afterEach(reset)

  const userAcceptsAll = jest.fn()
  const userPreference = {
    userAcceptsAll
  }

  const tellUsYouAcceptAllMatcher = /Tell us whether you accept cookies/
  const youveAcceptedAllMatcher = /You’ve accepted all cookies/

  const clickAcceptAll = () => {
    // getByText will fail the test if the text is not found
    // Finding elements by text makes the tests similar to how a user would interact with the page
    fireEvent.click(getByText(document.body, 'Accept all cookies'))
  }

  const clickHide = () => {
    fireEvent.click(getByText(document.body, 'Hide'))
  }

  it('should render a banner', () => {
    renderBanner({})

    expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeTruthy()
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

  describe('Meta tests', () => {
    it('should reset state between tests', () => {
      expect(queryByText(document.body, tellUsYouAcceptAllMatcher)).toBeFalsy()
    })
  })
})
