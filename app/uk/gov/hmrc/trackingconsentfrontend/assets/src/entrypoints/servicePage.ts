import '../../styles/service-page.scss'
import renderBanner from '../ui/renderBanner'
import userPreferenceFactory from '../domain/userPreferenceFactory'
import enableGtm from '../interfaces/gtm'

enableGtm()
document.addEventListener('DOMContentLoaded', () => {
  renderBanner(userPreferenceFactory())
})
