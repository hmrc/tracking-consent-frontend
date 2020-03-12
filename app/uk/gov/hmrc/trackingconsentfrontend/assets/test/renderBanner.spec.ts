import {
  queryByText
} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import renderBanner from '../src/ui/renderBanner'

describe('index', () => {
  it('should render a banner', () => {
    renderBanner()

    expect(queryByText(document.body, /Tell us whether you accept cookies/)).toBeTruthy()
  })
})
