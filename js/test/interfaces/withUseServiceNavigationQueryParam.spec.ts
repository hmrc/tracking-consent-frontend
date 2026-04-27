import '@testing-library/jest-dom';

import withUseServiceNavigationQueryParam from '../../src/interfaces/withUseServiceNavigationQueryParam';

describe('withUseServiceNavigationQueryParam', () => {
  test('returns the url unchanged when data-use-service-nav is not present and service navigation not used on page', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
      <html>
        <head>
            <script src="/another-script.js"></script>
            <script id="tracking-consent-script-tag" data-test="some-config"></script>
            <script src="/a-further-script.js"></script>
        </head>
        <body>
        </body>
      </html> 
   `;

    expect(
      withUseServiceNavigationQueryParam('/tracking-consent/cookie-settings'),
    ).toBe(
      '/tracking-consent/cookie-settings',
    );
  });

  test('adds query param when data-use-service-nav is present on script tag', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
        <html>
            <head>
                <script src="/another-script.js"></script>
                <script id="tracking-consent-script-tag" data-test="some-config" data-use-service-nav></script>
                <script src="/a-further-script.js"></script>
            </head>
            <body>
            </body>
        </html> 
    `;

    expect(
      withUseServiceNavigationQueryParam('/tracking-consent/cookie-settings'),
    ).toBe(
      '/tracking-consent/cookie-settings?useServiceNavigation',
    );
  });

  test('adds query param when data-use-service-nav is present on script tag, regardless of value', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
        <html>
            <head>
                <script src="/another-script.js"></script>
                <script id="tracking-consent-script-tag" data-test="some-config" data-use-service-nav="false"></script>
                <script src="/a-further-script.js"></script>
            </head>
            <body>
            </body>
        </html> 
    `;

    expect(
      withUseServiceNavigationQueryParam('/tracking-consent/cookie-settings'),
    ).toBe(
      '/tracking-consent/cookie-settings?useServiceNavigation',
    );
  });

  test('adds query param when service navigation is used on page', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
        <html>
            <head>
                <script src="/another-script.js"></script>
                <script id="tracking-consent-script-tag" data-test="some-config"></script>
                <script src="/a-further-script.js"></script>
            </head>
            <body>
              <div class="govuk-service-navigation"></div>
            </body>
        </html> 
    `;

    expect(
      withUseServiceNavigationQueryParam('/tracking-consent/cookie-settings'),
    ).toBe(
      '/tracking-consent/cookie-settings?useServiceNavigation',
    );
  });
});
