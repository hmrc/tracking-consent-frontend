import '../styles/styles.scss'
import renderBanner from './ui/renderBanner'
import userPreferenceFactory from './userPreferenceFactory'
import enableGtm from './enableGtm'

enableGtm()
document.addEventListener('DOMContentLoaded', () => {
  renderBanner(userPreferenceFactory())
})
