/* global spyOn */

import {
  queryByText
} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import userPreferenceFactory from '../src/userPreferenceFactory'
import renderBanner from '../src/ui/renderBanner'

describe('index', () => {
  const reset = () => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  }
  const click = (elem) => {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('click', false, true)
    elem.dispatchEvent(event)
  }
  const assume = expect

  beforeAll(reset)
  afterEach(reset)

  it('should render a banner', () => {
    renderBanner({})

    expect(queryByText(document.body, /Tell us whether you accept cookies/)).toBeTruthy()
  })

  it('should call preference manager when user accepts', () => {
    const userPreference = userPreferenceFactory()
    spyOn(userPreference, 'userAcceptsAll')
    renderBanner(userPreference)
    const acceptAllButton = document.querySelector('.cookie-banner .acceptAll')
    assume(userPreference.userAcceptsAll).not.toHaveBeenCalled()

    click(acceptAllButton)
    expect(userPreference.userAcceptsAll).toHaveBeenCalledWith()
  })

  describe('Meta tests', () => {
    it('should reset state between tests', () => {
      expect(queryByText(document.body, /Tell us whether you accept cookies/)).toBeFalsy()
    })
  })
})
