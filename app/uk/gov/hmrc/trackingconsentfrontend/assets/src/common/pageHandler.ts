import enableGtm from "../interfaces/gtm";
import {UserPreferences} from "../../types/UserPreferences";
import withContentLoaded from "./withContentLoaded";

const pageHandler = (document, userPreference: UserPreferences, pageRenderer) => {
    enableGtm()
    userPreference.sendPreferences()
    withContentLoaded(pageRenderer)(document, userPreference)
}

export default pageHandler