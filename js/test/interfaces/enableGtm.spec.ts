/* eslint-disable dot-notation */
import enableGtm from '../../src/interfaces/enableGtm';

describe('enableGtm', () => {
  beforeEach(() => {
    delete window.dataLayer;
    document.getElementsByTagName('html')[0].innerHTML = '<head><script/></head>';
  });

  it('should inject a script tag', () => {
    enableGtm('');

    expect(document.querySelectorAll('script')).toHaveLength(2);
  });

  it('should inject an async script tag pointed to gtm with the given container id', () => {
    enableGtm('GTM-CONTAINER-ID');

    // @ts-ignore
    const scriptElement: HTMLScriptElement = document.querySelector('script');
    expect(scriptElement.src).toEqual('https://www.googletagmanager.com/gtm.js?id=GTM-CONTAINER-ID');
    expect(scriptElement.async).toEqual(true);
  });

  it('should inject an async script tag with the correct nonce', () => {
    document.getElementsByTagName('html')[0].innerHTML = '<head><script nonce="abcdefg"/></head>';

    enableGtm('GTM-CONTAINER-ID');

    // @ts-ignore
    const scriptElement: HTMLScriptElement = document.querySelector('script');
    expect(scriptElement.nonce).toEqual('abcdefg');
  });

  it('should initialise the dataLayer', () => {
    enableGtm('GTM-CONTAINER-ID');

    expect(window.dataLayer[1]['gtm.start']).toBeDefined();
    expect(window.dataLayer[1].event).toEqual('gtm.js');
  });

  it('should include in the dataLayer a custom dimension for identifying as GTM via tracking-consent-frontend', () => {
    enableGtm('GTM-CONTAINER-ID');

    // data layer variables expected to exist on page load should be set before the GTM snippet is
    // loaded: https://developers.google.com/tag-manager/devguide
    expect(window.dataLayer[0]).toEqual({ trackingConsentLoaded: true });
  });

  it('should initialise the dataLayer only once', () => {
    enableGtm('GTM-CONTAINER-ID');

    expect(window.dataLayer.filter(({ event }) => event === 'gtm.js')).toHaveLength(1);
  });

  it('should add a gtm.start event after any existing events', () => {
    window.dataLayer = ['abc'];

    enableGtm('GTM-CONTAINER-ID');

    expect(window.dataLayer[2]['gtm.start']).toBeDefined();
  });

  it('should throw an error if the page does not contain a script tag', () => {
    document.getElementsByTagName('html')[0].innerHTML = '';

    expect(() => enableGtm('GTM-CONTAINER-ID')).toThrow('Unable to enable GTM because no script tag exists in the page');
  });

  it('throw an error if the container ID has not been defined', () => {
    expect(() => enableGtm(undefined)).toThrow('Unable to enable GTM because no container has been specified');
  });
});
