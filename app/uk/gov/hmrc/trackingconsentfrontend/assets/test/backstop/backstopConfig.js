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
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Click accept additional',
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      clickSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Click reject additional',
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      clickSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Hover on accept additional button',
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      hoverSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Hover on Reject All button',
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      hoverSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to Skip Link',
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      onReadyScript: 'tabToSkipLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to Link',
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      onReadyScript: 'tabToCookiesLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to accept additional',
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to Cookie Settings',
      url: `http://${host}:${port}/?enableTrackingConsent=true`,
      onReadyScript: 'tabToViewCookies.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Click accept additional',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      clickSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Click reject additional',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      clickSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Hover on accept additional button',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      hoverSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Hover on Reject All button',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      hoverSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to Skip Link',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      onReadyScript: 'tabToSkipLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to Link',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      onReadyScript: 'tabToCookiesLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to accept additional',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to Cookie Settings',
      url: `http://${host}:${port}/assets-frontend.html?enableTrackingConsent=true`,
      onReadyScript: 'tabToViewCookies.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services',
      url: `http://${host}:${port}/classic-services.html?enableTrackingConsent=true`,
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Click accept additional',
      url: `http://${host}:${port}/classic-services.html?enableTrackingConsent=true`,
      clickSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Click reject additional',
      url: `http://${host}:${port}/classic-services.html?enableTrackingConsent=true`,
      clickSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Hover on accept additional button',
      url: `http://${host}:${port}/classic-services.html?enableTrackingConsent=true`,
      hoverSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Hover on reject additional button',
      url: `http://${host}:${port}/classic-services.html?enableTrackingConsent=true`,
      hoverSelector: '.cbanner-govuk-button[value=reject]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to Link',
      url: `http://${host}:${port}/classic-services.html?enableTrackingConsent=true`,
      onReadyScript: 'tabToSkipLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to accept additional',
      url: `http://${host}:${port}/classic-services.html?enableTrackingConsent=true`,
      onReadyScript: 'tabToCookiesLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to Cookie Settings',
      url: `http://${host}:${port}/classic-services.html?enableTrackingConsent=true`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
  ],
  paths: {
    bitmaps_reference: 'test/backstop/backstop_data/bitmaps_reference',
    bitmaps_test: 'test/backstop/backstop_data/bitmaps_test',
    engine_scripts: 'test/backstop/backstop_data/engine_scripts',
    html_report: 'test/backstop/backstop_data/html_report',
    ci_report: 'test/backstop/backstop_data/ci_report',
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
});
