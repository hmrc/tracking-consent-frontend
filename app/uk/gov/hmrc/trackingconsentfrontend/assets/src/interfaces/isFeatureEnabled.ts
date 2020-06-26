const isFeatureEnabled = (featureName: String) => {
    function getEnabledFlagFromQuery(featureName: String) {
        return (window.location.search.includes(featureName.concat('=true')))
    }

    return getEnabledFlagFromQuery(featureName)
}

export default isFeatureEnabled