import Cookies from 'js-cookie'

const isFeatureEnabled = (featureName: String) => {
    function getEnabledFlagFromCookie(featureName: String) {
        return (Cookies.get(featureName) == 'true')
    }

    function getEnabledFlagFromQuery(featureName: String) {
        return window.location.search.includes(featureName.concat('=true'))
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