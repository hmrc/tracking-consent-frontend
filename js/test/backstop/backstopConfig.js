const { platform } = require('node:process')

module.exports = ({ host, port }) => ({
  dockerCommandTemplate: `docker run ${platform === 'linux' ? '--add-host host.docker.internal:host-gateway' : ''} --rm -it --mount type=bind,source="{cwd}",target=/src backstopjs/backstopjs:{version} {backstopCommand} {args}`,
  id: 'backstop_default',
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
      label: 'Tracking Consent - Cookie Banner - Tab to accept additional',
      url: `http://${host}:${port}/`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Tab to reject additional',
      url: `http://${host}:${port}/`,
      onReadyScript: 'tabToRejectAdditional.js',
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
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to accept additional',
      url: `http://${host}:${port}/assets-frontend.html`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Assets Frontend - Tab to reject additional',
      url: `http://${host}:${port}/assets-frontend.html`,
      onReadyScript: 'tabToRejectAdditional.js',
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
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to Skip Link',
      url: `http://${host}:${port}/classic-services.html`,
      onReadyScript: 'tabToSkipLink.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to accept additional',
      url: `http://${host}:${port}/classic-services.html`,
      onReadyScript: 'tabToAcceptAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to reject additional',
      url: `http://${host}:${port}/classic-services.html`,
      onReadyScript: 'tabToRejectAdditional.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Classic Services - Tab to Cookie Settings',
      url: `http://${host}:${port}/classic-services.html`,
      onReadyScript: 'tabToViewCookies.js',
      readySelector: '.cbanner-govuk-cookie-banner',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Rebranded service',
      url: `http://${host}:${port}/`,
      enableRebrand: true, // won't work if you override onReadyScript
    },
    {
      label: 'Tracking Consent - Cookie Banner - Rebranded service - Click accept additional',
      url: `http://${host}:${port}/`,
      enableRebrand: true,
      clickSelector: '.cbanner-govuk-button[value=accept]',
    },
    {
      label: 'Tracking Consent - Cookie Banner - Rebranded service - Click reject additional',
      url: `http://${host}:${port}/`,
      enableRebrand: true,
      clickSelector: '.cbanner-govuk-button[value=reject]',
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
  engine: 'playwright',
  engineOptions: {
    args: [
      '--no-sandbox',
    ],
  },
  misMatchThreshold: 0,
  asyncCaptureLimit: 5, // try reducing this in case of issues on Apple Silicon
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
});
