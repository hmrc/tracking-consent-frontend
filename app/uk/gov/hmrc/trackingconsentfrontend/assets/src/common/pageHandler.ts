import enableGtm from "../interfaces/gtm";
import {UserPreferences} from "../../types/UserPreferences";

const pageHandler = (document, userPreference: UserPreferences, pageRenderer) => {
    enableGtm()
    userPreference.sendPreferences()
    document.addEventListener('DOMContentLoaded', () => {
      pageRenderer(document, userPreference)
    })
}

export default pageHandler