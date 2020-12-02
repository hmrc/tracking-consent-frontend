/* eslint-disable dot-notation */
import enableGtm from '../../src/interfaces/enableGtm';

describe('enableGtm', () => {
  beforeEach(() => {
    delete window['dataLayer'];
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

    expect(window['dataLayer'][0]['gtm.start']).toBeDefined();
    expect(window['dataLayer'][0].event).toEqual('gtm.js');
  });

  it('should initialise the dataLayer only once', () => {
    enableGtm('GTM-CONTAINER-ID');

    expect(window['dataLayer'].filter(({ event }) => event === 'gtm.js')).toHaveLength(1);
  });

  it('should add a gtm.start event after any existing events', () => {
    window['dataLayer'] = ['abc'];

    enableGtm('GTM-CONTAINER-ID');

    expect(window['dataLayer'][1]['gtm.start']).toBeDefined();
  });

  it('should run without errors if the page does not contain a script tag', () => {
    document.getElementsByTagName('html')[0].innerHTML = '';

    enableGtm('GTM-CONTAINER-ID');
  });

  it('throw an error if the container ID has not been defined', () => {
    expect(() => enableGtm(undefined)).toThrow('Unable to enable GTM because no container has been specified');
  });
});
