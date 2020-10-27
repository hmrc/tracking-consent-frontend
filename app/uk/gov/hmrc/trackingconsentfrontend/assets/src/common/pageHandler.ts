import enableGtm from '../interfaces/enableGtm'
import { UserPreferences } from '../../types/UserPreferences'
import isFeatureEnabled from "../interfaces/isFeatureEnabled";
import { enableTrackingConsent } from "../constants/featureNames";
import { SERVICE_PAGE_LOAD_EVENT } from "../constants/events";
import getGtmContainerId from "./getGtmContainerId";

const pageHandler = (document: HTMLDocument, userPreference: UserPreferences, pageRenderer, containerId) => {
    const gtmContainerId = getGtmContainerId()
    if (gtmContainerId === undefined) {
        console.warn("Deprecation notice: container id not specified in data-gtm-container attribute. The functionality you are currently using will be removed on 03 November 2020")
    }

    enableGtm(gtmContainerId || containerId)
    if (isFeatureEnabled(enableTrackingConsent)) {
        userPreference.sendPreferences(SERVICE_PAGE_LOAD_EVENT)
        document.addEventListener('DOMContentLoaded', () => {
            pageRenderer(userPreference)
        })
    }
}

export default pageHandler
