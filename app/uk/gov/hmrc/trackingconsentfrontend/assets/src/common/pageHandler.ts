import enableGtm from '../interfaces/enableGtm'
import { UserPreferences } from '../../types/UserPreferences'
import isFeatureEnabled from "../interfaces/isFeatureEnabled";
import { enableTrackingConsent } from "../constants/featureNames";
import { SERVICE_PAGE_LOAD_EVENT } from "../constants/events";

const pageHandler = (document: HTMLDocument, userPreference: UserPreferences, pageRenderer, containerId) => {
    enableGtm(containerId)
    if (isFeatureEnabled(enableTrackingConsent)) {
        userPreference.sendPreferences(SERVICE_PAGE_LOAD_EVENT)
        document.addEventListener('DOMContentLoaded', () => {
            pageRenderer(userPreference)
        })
    }
}

export default pageHandler