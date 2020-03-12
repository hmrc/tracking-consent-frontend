import {
  queryByText
} from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import render from '../src/render'

describe('index', () => {
  it('should render hello world', () => {
    render()

    expect(queryByText(document.body, /Hello World/)).toBeTruthy()
  })
})
