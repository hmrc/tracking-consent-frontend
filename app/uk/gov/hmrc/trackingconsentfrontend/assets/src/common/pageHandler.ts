import enableGtm from '../interfaces/enableGtm'
import { UserPreferences } from '../../types/UserPreferences'
import isFeatureEnabled from "../interfaces/isFeatureEnabled";
import {enableTrackingConsent} from "../constants/featureNames";

const pageHandler = (document: HTMLDocument, userPreference: UserPreferences, pageRenderer, containerId) => {
    enableGtm(containerId)
    if (isFeatureEnabled(enableTrackingConsent)) {
        userPreference.sendPreferences()
        document.addEventListener('DOMContentLoaded', () => {
            pageRenderer(userPreference)
        })
    }
}

export default pageHandler