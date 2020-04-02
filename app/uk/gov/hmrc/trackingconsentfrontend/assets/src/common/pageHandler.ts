import enableGtm from "../interfaces/gtm";
import {UserPreferences} from "../../types/UserPreferences";

const pageHandler = (userPreference: UserPreferences, pageRenderer) => {
    enableGtm()
    userPreference.sendPreferences()
    pageRenderer(document, userPreference)
}

export default pageHandler