import '../../styles/service-page.scss'
import renderBanner from '../ui/renderBanner'
import userPreferenceFactory from '../domain/userPreferenceFactory'
import enableGtm from '../interfaces/gtm'
import preferenceCommunicatorFactory from "../interfaces/preferenceCommunicatorFactory"

const userPreference = userPreferenceFactory(preferenceCommunicatorFactory(window))

enableGtm()
userPreference.sendPreferences()
document.addEventListener('DOMContentLoaded', () => {
  renderBanner(userPreference)
})
