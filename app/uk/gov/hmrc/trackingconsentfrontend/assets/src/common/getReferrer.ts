const getReferrer = (): string => {
  if (typeof URL !== 'function') {
    return '';
  }
  const url = document.referrer && new URL(document.referrer);
  return url ? `${url.pathname}${url.search}` : '';
};

export default getReferrer;
