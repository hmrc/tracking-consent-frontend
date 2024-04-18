module.exports = ({ host, port }) => ({
  id: 'backstop_default',
  dockerCommandTemplate: 'docker run --rm -i --mount type=bind,source="{cwd}",target=/src backstopjs/backstopjs:{version} {backstopCommand} {args}',
  viewports: [
    {
      label: 'phone',
      width: 320,
      height: 480,
    },
    {
      label: 'tablet',
      width: 1024,
      height: 768,
    },
  ],
  onReadyScript: 'puppet/onReady.js',
  scenarios: [
    {
      label: 'Tracking Consent - Cookie Banner',
      url: `http://${host}:${port}/`,
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Click accept additional',
      url: `http://${host}:${port}/`,
      clickSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Click reject additional',
      url: `http://${host}:${port}/`,
      clickSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Hover on accept additional button',
      url: `http://${host}:${port}/`,
      hoverSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Hover on Reject All button',
      url: `http://${host}:${port}/`,
      hoverSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to Skip Link',
      url: `http://${host}:${port}/`,
      onReadyScript: 'tabToSkipLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to Link',
      url: `http://${host}:${port}/`,
      onReadyScript: 'tabToCookiesLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to accept additional',
      url: `http://${host}:${port}/`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to Cookie Settings',
      url: `http://${host}:${port}/`,
      onReadyScript: 'tabToViewCookies.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend',
      url: `http://${host}:${port}/assets-frontend.html`,
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Click accept additional',
      url: `http://${host}:${port}/assets-frontend.html`,
      clickSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Click reject additional',
      url: `http://${host}:${port}/assets-frontend.html`,
      clickSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Hover on accept additional button',
      url: `http://${host}:${port}/assets-frontend.html`,
      hoverSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Hover on Reject All button',
      url: `http://${host}:${port}/assets-frontend.html`,
      hoverSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to Skip Link',
      url: `http://${host}:${port}/assets-frontend.html`,
      onReadyScript: 'tabToSkipLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to Link',
      url: `http://${host}:${port}/assets-frontend.html`,
      onReadyScript: 'tabToCookiesLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to accept additional',
      url: `http://${host}:${port}/assets-frontend.html`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to Cookie Settings',
      url: `http://${host}:${port}/assets-frontend.html`,
      onReadyScript: 'tabToViewCookies.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services',
      url: `http://${host}:${port}/classic-services.html`,
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Click accept additional',
      url: `http://${host}:${port}/classic-services.html`,
      clickSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Click reject additional',
      url: `http://${host}:${port}/classic-services.html`,
      clickSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Hover on accept additional button',
      url: `http://${host}:${port}/classic-services.html`,
      hoverSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Hover on reject additional button',
      url: `http://${host}:${port}/classic-services.html`,
      hoverSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to Link',
      url: `http://${host}:${port}/classic-services.html`,
      onReadyScript: 'tabToSkipLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to accept additional',
      url: `http://${host}:${port}/classic-services.html`,
      onReadyScript: 'tabToCookiesLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to Cookie Settings',
      url: `http://${host}:${port}/classic-services.html`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
  ],
  paths: {
    bitmaps_reference: 'js/test/backstop/backstop_data/bitmaps_reference',
    bitmaps_test: 'js/test/backstop/backstop_data/bitmaps_test',
    engine_scripts: 'js/test/backstop/backstop_data/engine_scripts',
    html_report: 'js/test/backstop/backstop_data/html_report',
    ci_report: 'js/test/backstop/backstop_data/ci_report',
  },
  report: [
    'browser',
  ],
  engine: 'puppeteer',
  engineOptions: {
    args: [
      '--no-sandbox',
    ],
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
  misMatchThreshold: 0,
  resembleOutputOptions: {
    ignoreAntialiasing: true,
    usePreciseMatching: true,
  },
});
