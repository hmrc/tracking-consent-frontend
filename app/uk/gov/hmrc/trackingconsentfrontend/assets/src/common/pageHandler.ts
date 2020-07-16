import enableGtm from '../interfaces/enableGtm'
import { UserPreferences } from '../../types/UserPreferences'

const pageHandler = (document: HTMLDocument, userPreference: UserPreferences, pageRenderer, containerId) => {
    enableGtm(containerId)
    userPreference.sendPreferences()
    document.addEventListener('DOMContentLoaded', () => {
      pageRenderer(userPreference)
    })
}

export default pageHandler