import { getLocalBaseUrl } from "../config/config";

const getTrackingConsentBaseUrl = () => {
    const host: string = window.location.host
    const search = 'localhost'
    const isLocal = typeof host === 'string' && (host.substring(0, search.length) === search)
    return isLocal ? getLocalBaseUrl() : ''
}

export default getTrackingConsentBaseUrl
