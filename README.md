# Tracking Consent Frontend
Tracking Consent Frontend is a solution intended to address the need for users visiting the public-facing HMRC tax platform 
(www.tax.service.gov.uk) to provide their explicit informed consent to the use of non-essential cookies.

Tracking consent provides:
1. A Javascript asset intended to be included by all frontend microservices running under www.tax.service.gov.uk to
    1. centralise the enabling of Google Tag Manager and Google Analytics
    1. inject an opt-in banner for tax users to 'Accept All' cookies or navigate to,
1. a cookie settings page that allows tracking preferences to be adjusted

Currently only 1.i is fully enabled in production, 1.ii and 2 are enabled behind a query-string 
based feature flag and will be turned on centrally at a later date.

## Should my service be integrating with tracking-consent-frontend?
If you have a public-facing microservice running under `www.tax.service.gov.uk`, you should integrate with the
`tracking-consent-frontend` microservice to provide an opt-in banner for cookie consent.

## How do I integrate with tracking consent?
Tracking consent is designed to be used in conjunction with HMRC's frontend libraries.

Integration guidelines for play-frontend-hmrc can be found [here](https://github.com/hmrc/play-frontend-hmrc#integrating-with-tracking-consent).

Integration guidelines for older services using play-ui can be found [here](https://github.com/hmrc/play-ui#integrating-with-tracking-consent)

If you are not able to use the above libraries, please contact #team-plat-ui for integration advice.

## How do I test the integration locally?
When developing locally you can use [service manager](https://github.com/hmrc/service-manager)
and run

```
sm --start TRACKING_CONSENT_FRONTEND
```

To enable the tracking consent banner on your service and check that it displays correctly, add the `?enableTrackingConsent=true` 
parameter to any URL on your service. This will set a feature toggle cookie `enableTrackingConsent`
 enabling the banner for all subsequent service pages you test.

If you wish to reset behaviour, remove the enableTrackingConsent cookie from your browser.

## Content Security Policy
Because tracking consent depends on GTM, your service will need to have a CSP that is compatible with it. 
Google provides guidance on the minimum requirements [here](https://developers.google.com/tag-manager/web/csp). 

If you are using Play 2.7 or above and [CSPFilter](https://www.playframework.com/documentation/2.7.x/CspFilter), 
the configuration can be simplified by passing a nonce to the tracking consent helpers in 
play-frontend-hmrc or play-ui.

When developing locally you will additionally need to adjust your service's Content Security Policy (CSP) to
allow content from http://localhost:12345

Consult the [Play Framework](https://www.playframework.com/) documentation for advice on how to achieve this.
It depends on the version of Play you are using.

## How can I read and honour a user's cookie preferences?

Tracking consent stores cookie preferences in the `userConsent` cookie.  Readable on the server 
and client side, the contents are URL-encoded JSON with a structure described in 
the next section. However, it‘s not intended that you inspect this cookie manually – helper methods have
been created for reading it in Scala and Javascript.

For server-side reading of the `userConsent` cookie, please use the library 
[tracking-consent-models](https://github.com/hmrc/tracking-consent-models)

For client-side inspection, you can define a `Communicator` object and pass this to the 
`window.hmrcTrackingConsent.userPreferences.subscribe` function.

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

## Maintenance documentation
Maintenance documentation for the owning team, including architectural decision records (ADRs) can be found [here](docs/maintainers.md).

### License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
