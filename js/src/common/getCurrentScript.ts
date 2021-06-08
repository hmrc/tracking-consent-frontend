const getCurrentScript = (): HTMLScriptElement | undefined => {
  const scriptTag: HTMLScriptElement | null = document.querySelector('script[id="tracking-consent-script-tag"]');
  if (scriptTag === null) {
    return undefined;
  }
  return scriptTag;
};

export default getCurrentScript;
