# Tracking Consent Frontend
Tracking Consent Frontend is a solution intended to address the need for users visiting the public-facing HMRC tax platform 
(www.tax.service.gov.uk) to provide their explicit informed consent to the use of non-essential cookies.

Tracking consent provides a means to *capture* consent but is not itself responsible for ensuring this consent is
correctly honoured by consuming services. Tracking consent does not actively allow or block cookies nor does it
conditionally enable services such as Google Analytics or Optimizely.

Tracking consent provides:
1. A Javascript asset intended to be included by all frontend microservices running under www.tax.service.gov.uk to
    1. provide an integration with Google Tag Manager (GTM), the service used to centrally control the enablement of Google Analytics on the tax platform
    1. inject a banner for tax users to accept or reject additional cookies, storing these preferences
       in a `userConsent` cookie and notifying subscribed services on page load and following changes to them    
1. a cookie settings page that allows tracking preferences to be adjusted

## Should my service be integrating with tracking-consent-frontend?
If you have a public-facing microservice running under `www.tax.service.gov.uk`, you should integrate with the
`tracking-consent-frontend` microservice to provide an opt-in banner for cookie consent.

## How do I integrate with tracking consent?
Tracking consent is designed to be used in conjunction with HMRC's frontend libraries.

Integration guidelines for play-frontend-hmrc can be found [here](https://github.com/hmrc/play-frontend-hmrc#integrating-with-tracking-consent).

Integration guidelines for older services using play-ui can be found [here](https://github.com/hmrc/play-ui#integrating-with-tracking-consent)

If you are not able to use the above libraries, please contact #team-plat-ui for integration advice.

## How do I test the integration locally?

1. Use [service manager](https://github.com/hmrc/service-manager)
to spin up tracking consent locally on port 12345:

    ```
    sm --start TRACKING_CONSENT_FRONTEND
    ```

1. If you are not using CSPFilter, make the required modifications to your CSP policy (see below).
1. Navigate to a page on your service. You should see the [cookie banner](docs/screenshots/cookie-banner.png)
   at the top of the page, above the 'Skip to main content' link.
1. Toggle to the Welsh language, if applicable. You should see the cookie banner
translated into [Welsh](docs/screenshots/cookie-banner-welsh.png).
1. Click 'Accept additional cookies', you should see a [confirmation](docs/screenshots/accept-cookies.png).
1. Click 'Change your cookie settings'. You should see the [cookie settings page](docs/screenshots/cookie-settings.png).
1. Click 'Save changes'. You should be scrolled to the top of the page and see a [save confirmation](docs/screenshots/cookie-settings-save.png).

### Note on the back link when testing locally

When testing locally the 'Go back to the page you were looking at' link will either not display or will
navigate to `/` which is likely to result in a 404 page not found error. 

This is because:
* when running locally, tracking consent is running on a different port
* the back link uses `document.referrer` to identify the referring service url and the
`strict-origin-when-cross-origin` referrer policy prevents the full path from being available
  
If you wish to satisfy yourself that the back link is operating correctly, you will need to deploy to an environment.

## Content Security Policy
Because tracking consent depends on GTM, your service will need to have a CSP that is compatible with it. 
Google provides guidance on the minimum requirements [here](https://developers.google.com/tag-manager/web/csp). 

If you are using Play 2.7 or above and [CSPFilter](https://www.playframework.com/documentation/2.7.x/CspFilter), 
the configuration can be simplified by passing a nonce to the tracking consent helpers in 
play-frontend-hmrc or play-ui.

If you are not using CSPFilter, when developing locally you will additionally need to add `http://localhost:12345` to your
CSP's script-src. Without it, the cookie banner will not display.

Consult the [Play Framework](https://www.playframework.com/) documentation for advice on configuring your 
CSP policy in Play. It depends on the version of Play you are using.

### CSP for Google Analytics 4 (GA4)

As of [July 2023](https://support.google.com/analytics/answer/11583528?hl=en), Google will only be supporting GA4 for 
analytics. Specific CSP configuration is needed for GA4, and at the time of writing (**January 2023**), the CSP 
properties below are required in the service's `application.conf`.

**These properties should be included alongside any existing CSP configuration required for your service, such as the 
CSP nonce.** 

```
script-src https://www.googletagmanager.com https://tagmanager.google.com;
style-src https://tagmanager.google.com https://fonts.googleapis.com;
img-src 'self' https://ssl.gstatic.com www.gstatic.com https://www.google-analytics.com data https//region1.google-analytics.com https://region1.analytics.google.com https://*.google-analytics.com https://*.analytics.google.com;
font-src https://ssl.gstatic.com www.gstatic.com https://fonts.gstatic.com https://fonts.googleapis.com;
connect-src https//region1.google-analytics.com https://region1.analytics.google.com https://*.google-analytics.com https://*.analytics.google.com;
frame-src 'self' https://www.googletagmanager.com;
```
- If you have any question regarding integrating this with your service, please contact PlatUI via Slack. 
- If you a more general question regarding CSP, you may wish to discus with PlatSec via Slack.

## How can I read and honour a user's cookie preferences?

Tracking consent stores cookie preferences in the `userConsent` cookie.  Readable on the server 
and client side, the contents are URL-encoded JSON with a structure described in 
the next section. However, it‘s not intended that you inspect this cookie manually – helper methods have
been created for reading it in Scala and Javascript.

Your service can be made aware of the contents of this cookie either by inspecting it on demand or, on the 
client-side only, subscribing to updates.

### In Scala

For reading the cookie in server-side Scala, refer to the README in [hmrc/tracking-consent-models](https://www.github.com/hmrc/tracking-consent-models)

Your service will need to regularly update the version of this library in order to take advantage of changes to the underlying
cookie model.

### In Javascript

In Javascript, you can use the `window.trackingConsent.UserPreferences` object that has methods for querying the userConsent cookie and
for subscribing to notifications for updates to it.

For example, if you need to determine if the user has accepted `settings` cookies,

```javascript
if (window.trackingConsent.userPreferences.getPreferences().settings) {
  document.cookie = 'darkMode=true;path=/;Max-Age=31536000;';
}
```

If you want to perform an action only once the user has accepted settings cookies via the banner,

```javascript
const communicator = {
  sendPreferences: (userPreferences, event) => {
    if (userPreferences.getPreferences().settings && event === 'CONSENT_UPDATED_EVENT') {
      document.cookie = 'textSize=large;path=/;Max-Age=31536000;';
    }
  }
}

window.trackingConsent.userPreferences.subscribe(communicator);
```

In the above example, event is set to either `SERVICE_PAGE_LOAD_EVENT` or `CONSENT_UPDATED_EVENT`. The 
`SERVICE_PAGE_LOAD_EVENT` is sent on the initial page load. The `CONSENT_UPDATED_EVENT` is sent when
a user explicitly changes their settings via the cookie banner or the cookie settings page.

### Cookie structure

Represented as a Typescript type, the structure of the URL-decoded userConsent cookie is as follows: 

```ts
 {
  version: string, // 2021.1
  datetimeSet: string, // e.g. 2021-03-04T15:16:47.077Z
  preferences: {
    measurement?: boolean, // e.g. true
    settings?: boolean // e.g. false
  }
}
```

#### version

A string of the form YYYY.N, where YYYY is the year and N is a positive integer e.g. 2022.5. 

The version number allows consuming services to know exactly which version of the user consent cookie was 
in use at the time the user consented. Any breaking changes to the descriptions of the cookie categories on the 
cookie settings page should result in a new version number as it affects what exactly the user has consented to.

#### datetimeSet

The date and time the cookie was set in UTC, ISO 8106 format e.g. 2021-03-04T15:16:47.077Z

#### preferences

A JSON object with the following optional keys:
* measurement: when set to true, this indicates the user has consented to measurement cookies being stored on their device.
* settings: when set to true, this indicates the user has consented to settings cookies being stored on their device.

Each preference setting should be interpreted as a strict boolean value. So-called ‘truthy’ values or even the literal string “true” should be interpreted as the user having rejected cookies.

In raw form the cookie value might look like:

```text
{%22version%22:%222021.1%22%2C%22datetimeSet%22:%222021-03-10T13:48:19.321Z%22%2C%22preferences%22:{%22measurement%22:false%2C%22settings%22:false}}
```

This would result in the following URL-decoded value:

```json
{"version":"2021.1","datetimeSet":"2021-03-10T13:48:19.321Z","preferences":{"measurement":false,"settings":false}}
```

## Internal services and user tracking
This service is NOT intended for use on internal HMRC services which live on the internal domain. If you
require user tracking for an internal service, please talk to your Performance Analyst to implement directly.  

## Integration with Google Tag Manager

Tracking consent frontend provides a standardised GTM integration that means service teams do not need to add a separate
GTM snippet in addition to tracking-consent-frontend tracking.js snippet. Tracking consent uses the GTM
[datalayer](https://developers.google.com/tag-manager/devguide#datalayer)
to send messages to GTM in the form of events and variables that allows analytics tags to be configured such that they
will only be added when a user has properly consented.

### Datalayer Variables

On page load, tracking consent initialises the datalayer with the following variables:

| Variable | Description | Possible values |
| -------- | ----------- | --------------- |
| `trackingConsentLoaded` | Set to true if the service has integrated with tracking-consent-frontend | `true` or `undefined` |
| `trackingConsentMeasurementAccepted` | Set to `true` if the user has accepted measurement cookies or `false` otherwise | `true` or `false` |
| `trackingConsentSettingsAccepted` | Set to `true` if the user has accepted settings cookies or `false` otherwise | `true` or `false` |

When a user changes their cookie settings by accepting or rejecting cookies in the banner, or by
toggling different settings on the cookie settings page, the variables
`trackingConsentMeasurementAccepted` and `trackingConsentSettingsAccepted` are dynamically updated to
reflect the user's adjusted settings.

### Datalayer Events

GTM has a special data layer variable called an event that can be used to initiate tag firing when a user performs some
action on a service page, such as clicking on a button.

Tracking consent sends the following events to GTM via the datalayer:

`trackingConsentMeasurementAccepted` is sent when

* a user clicks 'Accept additional cookies'
* clicks 'Save changes' on the cookie settings page having toggled the 'Use cookies that measure my website use' radio button.
* on page load, if the user has already accepted measurement cookies on a visit to any other service on the tax platform
  using one of the mechanisms above

`trackingConsentSettingsAccepted` is sent when

* a user clicks 'Accept additional cookies'
* clicks 'Save changes' on the cookie settings page having toggled the 'Use cookies that remember my settings on services' radio button.
* on page load, if the user has already accepted settings cookies on a visit to any other service on the tax platform using one
  of the mechanisms above

Internally this mechanism is implemented via
[gtmCommunicatorFactory](js/src/interfaces/gtmCommunicatorFactory.ts).
Messages are sent to GTM for both `SERVICE_PAGE_LOAD_EVENT` and `CONSENT_UPDATED_EVENT` events.

## Integration with Optimizely

[Optimizely](https://www.optimizely.com) is a client-side solution for A/B testing that relies on cookies.
It supports a [mechanism](https://help.optimizely.com/Account_Settings/Enable_opt-in_options_for_Optimizely_cookies_and_local_storage)
for opting a user out of cookie and local storage that is implemented by tracking consent. However, for this to work correctly it
is imperative that:
* tracking consent is loaded *synchronously* in the HEAD element – there must be *no* async attribute
* tracking consent is loaded *before* the Optimizely snippet
* the Optimizely snippet is wrapped in a conditional comment to prevent its inclusion on IE8 or IE9 browsers. Tracking
  consent does not support these browsers.

Due to the above complexities, it is highly recommended that consuming services using the Play framework use the
tracking consent helpers provided in [play-frontend-hmrc](https://www.github.com/hmrc/play-frontend-hmrc) and
[play-ui](https://www.github.com/hmrc/play-ui)

The following should be noted as consequences of the above:
1. A/B testing will be disabled for users that have not accepted 'measurement' cookies before they navigated to the
   page under test.
1. Users that accept additional cookies using the cookie banner will only see variations following a page reload or on subsequent
   pages in the user journey. They will not see the page change to a variation following acceptance.

Internally this mechanism is implemented via
[optimizelyCommunicatorFactory](js/src/interfaces/optimizelyCommunicatorFactory.ts).
An opt-out message is sent to Optimizely for both `SERVICE_PAGE_LOAD_EVENT` and `CONSENT_UPDATED_EVENT` events.

### Optimizely integration with Google Analytics using Google Tag Manager

In order for analytics data relating to Optimizely experiments to be successfully communicated
to Google Analytics, a special Universal Analytics GTM tag must be configured according to the
instructions on the [Optimizely website](https://help.optimizely.com/Integrate_Other_Platforms/Integrate_Optimizely_X_with_Google_Universal_Analytics_using_Google_Tag_Manager)
This configuration must be carried out once for each GTM container.

As a convenience, tracking consent hosts the [custom integration code](js/src/entrypoints/optimizely.js) under
the endpoint https://www.tax.service.gov.uk/tracking-consent/tracking/optimizely.js needed by Step 9 of the above integration guide.
This means it is not necessary to carry out Step 9 - Custom HTML tag described in the above integration guide. The tracking consent
helpers in `hmrc/play-frontend-hmrc` and `hmrc/play-ui` add this snippet *after* the optimizely snippet,
to ensure the Optimizely object is available when it runs.

## Integration with internal auditing

For auditing purposes, when cookie preferences are changed using the cookie banner or cookie settings page, tracking consent performs an XHR POST request to the
`/tracking-consent/audit` endpoint with a payload containing the cookie preferences selected by the user. For example, clicking 'Accept additional cookies'
results in a request similar to the following (with some headers removed):

```http request
POST /tracking-consent/audit HTTP/1.1
Host: www.tax.service.gov.uk
Csrf-Token: nocheck
Content-type: application/json
Origin: https://www.tax.service.gov.uk
Cookie: ...

{"measurement":true,"settings":true}
```

This request results in tracking consent sending an implicit audit event to the datastream microservice via the audit filter
in [bootstrap-play](https://github.com/hmrc/bootstrap-play) that internally uses the audit connector from 
[play-auditing](https://github.com/hmrc/play-auditing) library.

Internally this mechanism is implemented via 
[auditCommunicatorFactory](js/src/interfaces/auditCommunicatorFactory.ts), listening
to events of type `CONSENT_UPDATED_EVENT` only.

## What will happen when a user revokes previously granted tracking consent?

When a user grants tracking consent, GTM will be loaded on the page and that will create Google Analytics cookies on
the tax.service.gov.uk domain. If a user then revokes their consent, these cookies will remain, but their tracking
preference will be updated and on future navigation GTM will not be loaded and no tracking data will be sent. The Google
analytics cookies will remain in the users browser until they expire, you can view further details about the nature of
the cookies within [the google analytics documenation on cookie usage](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage).

## Maintenance documentation
Maintenance documentation for the owning team, including architectural decision records (ADRs) can be found [here](docs/maintainers.md).

### License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
