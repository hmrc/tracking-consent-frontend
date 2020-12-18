import Cookies from 'js-cookie';

const isFeatureEnabled = (featureName: String) => {
  const getEnabledFlagFromCookie = (theFeatureName: String) => (Cookies.get(theFeatureName) === 'true');

  const getEnabledFlagFromQuery = (theFeatureName: String) => window.location.search.includes(`${theFeatureName}=true`);

  if (getEnabledFlagFromCookie(featureName)) {
    return true;
  } if (getEnabledFlagFromQuery(featureName)) {
    Cookies.set(featureName, 'true');
    return true;
  }
  return false;
};

export default isFeatureEnabled;
