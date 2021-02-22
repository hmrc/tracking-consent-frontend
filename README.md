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
When developing locally you will additionally need to adjust your service's Content Security Policy (CSP) to
allow content from http://localhost:12345

Consult the [Play Framework](https://www.playframework.com/) documentation for advice on how to achieve this.
It depends on the version of Play you are using.

## Internal services and user tracking
This service is NOT intended for use on internal HMRC services which live on the internal domain. If you
require user tracking for an internal service, please talk to your Performance Analyst to implement directly.  

## Maintenance documentation
Maintenance documentation for the owning team, including architectural decision records (ADRs) can be found [here](docs/maintainers.md).

### License
This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
