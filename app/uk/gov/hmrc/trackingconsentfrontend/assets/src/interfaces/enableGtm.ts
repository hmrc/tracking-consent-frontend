import getNonce from '../common/getNonce';

const dataLayer = 'dataLayer';
const gtmBaseUrl = 'https://www.googletagmanager.com/gtm.js?id=';

const enableGtm = (containerId: string | undefined) => {
  if (containerId === undefined) {
    throw new Error('Unable to enable GTM because no container has been specified');
  }

  // eslint-disable-next-line no-param-reassign
  window[dataLayer] = window[dataLayer] || [];
  window[dataLayer].push({
    'tracking-consent-loaded': true,
  });
  window[dataLayer].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const scriptElement = document.getElementsByTagName('script')[0];
  if (scriptElement === undefined || scriptElement.parentNode === null) {
    throw new Error('Unable to enable GTM because no script tag exists in the page');
  }

  const asyncScriptElement: HTMLScriptElement = document.createElement('script');

  const nonce = getNonce();
  if (nonce !== undefined) {
    asyncScriptElement.setAttribute('nonce', nonce);
  }
  asyncScriptElement.async = true;
  asyncScriptElement.src = `${gtmBaseUrl}${containerId}`;
  scriptElement.parentNode.insertBefore(asyncScriptElement, scriptElement);
};

export default enableGtm;
