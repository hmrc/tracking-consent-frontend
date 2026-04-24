import getCurrentScript from '../common/getCurrentScript';

function currentPageIsUsingServiceNavigation() {
  return getCurrentScript()?.hasAttribute('data-use-service-nav')
        || document.querySelector('.govuk-service-navigation');
}

const withUseServiceNavigationQueryParam = (url: String) => {
  if (currentPageIsUsingServiceNavigation()) {
    return `${url}?useServiceNavigation`; // all we need for our narrow use case
  }
  return url;
};

export default withUseServiceNavigationQueryParam;
