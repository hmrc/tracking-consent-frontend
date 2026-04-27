import getCurrentScript from '../common/getCurrentScript';

function currentPageIsUsingServiceNavigation(): boolean {
  return Boolean(
    getCurrentScript()?.hasAttribute('data-use-service-nav')
      || document.querySelector('.govuk-service-navigation'),
  );
}

function withUseServiceNavigationQueryParam(url: string): string {
  if (currentPageIsUsingServiceNavigation()) {
    return `${url}?useServiceNavigation`; // all we need for our narrow use case
  }
  return url;
}

export default withUseServiceNavigationQueryParam;
