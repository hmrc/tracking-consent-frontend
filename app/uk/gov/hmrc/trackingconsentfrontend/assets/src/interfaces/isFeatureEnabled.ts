import Cookies from 'js-cookie'

const isFeatureEnabled = (featureName: String) => {

    const getEnabledFlagFromCookie = (featureName: String) => {
        return (Cookies.get(featureName) == 'true')
    }

    const getEnabledFlagFromQuery = (featureName: String) => {
        return window.location.search.includes(`${featureName}=true`)
    }

    if (getEnabledFlagFromCookie(featureName)) {
        return true
    } else if (getEnabledFlagFromQuery(featureName)) {
        Cookies.set(featureName, 'true')
        return true
    } else {
        return false
    }
}

export default isFeatureEnabled
