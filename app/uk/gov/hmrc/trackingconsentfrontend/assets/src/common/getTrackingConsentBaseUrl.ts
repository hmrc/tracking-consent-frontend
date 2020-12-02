import getCurrentScript from './getCurrentScript';

// IE compatible method for parsing URL
const extractBaseUrlFromUrl = (src: string): string | undefined => {
  const anchor: HTMLAnchorElement = document.createElement('a');
  anchor.href = src;
  const { protocol, host } = anchor;
  return `${protocol}//${host}`;
};

const getTrackingConsentBaseUrl = (): string | undefined => {
  const scriptTag: HTMLScriptElement | undefined = getCurrentScript();
  if (scriptTag === undefined) {
    return '';
  }

  const src: string | null = scriptTag.getAttribute('src');
  if (src === null) {
    return '';
  }

  return extractBaseUrlFromUrl(src);
};

export default getTrackingConsentBaseUrl;
