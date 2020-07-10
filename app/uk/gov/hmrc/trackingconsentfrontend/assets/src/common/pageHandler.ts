import enableGtm from '../interfaces/gtm'
import { UserPreferences } from '../../types/UserPreferences'

const pageHandler = (document: HTMLDocument, userPreference: UserPreferences, pageRenderer, containerId) => {
    enableGtm(containerId)
    userPreference.sendPreferences()
    document.addEventListener('DOMContentLoaded', () => {
      pageRenderer(userPreference)
    })
}

export default pageHandler