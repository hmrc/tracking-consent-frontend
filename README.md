# Tracking Consent Frontend

## Requirements

* [Node.js](https://nodejs.org/en/) `>= 12.13.1`

To install multiple versions of Node.js, you may find it easier to use a node version manager:

* [nvm](https://github.com/creationix/nvm)

## To run locally

```
sbt -Dapplication.router=testOnlyDoNotUseInAppConf.Routes run
```

The cookie banner should be available at http://localhost:12345/tracking-consent/test-only?enableTrackingConsent=true

If you do not initially include the `?enableTrackingConsent=true` section of the URL, the consent banner will not be displayed.

Once you have visited the page with `?enableTrackingConsent=true` once, a cookie will be set to enable the banner functionality on 
all future pages until the cookie is cleared.

Any changes to the Scala or Javascript should trigger a rebuild.

## Running all Scala and Javascript unit tests together

```
sbt test
```

## Running UI acceptance tests

The UI and ZAP tests are based on the template at https://github.com/hmrc/ui-test-template.g8
with some modifications to allow them to be run as part of the microservice
repository.

To run the UI acceptance tests locally, you will need a copy of Chrome
and the Chrome browser driver installed at /usr/local/bin/chromedriver
```
./run_acceptance_tests.sh
```

The Chrome driver is available at https://chromedriver.chromium.org/

## Running just the Javascript checks

Change to the Javascript assets directory:

```
cd app/uk/gov/hmrc/trackingconsentfrontend/assets
```

Audit dependencies:
 
```
npm audit
```

Run static analysis and auto fix:

```
npm run fixlint
```

Run unit tests and coverage:

```
npm run test
```

Analyse the bundle:

```
npm run analyze
```

## Running ZAP scan locally

To run the ZAP scan, you will need a copy of the ZAP proxy running locally on port 11000: https://www.zaproxy.org/, with the 
following options configured:

* under HUD, uncheck 'Enable when using the ZAP Desktop' (stops ZAP converting requests to HTTPS)
* under API, check 'Disable the API key'

```
sbt \
  -Dapplication.router=testOnlyDoNotUseInAppConf.Routes \
  -Dbrowser=chrome \
  -Dzap.proxy=true \
  acceptance:test zap:test
```

More information on HMRC's ZAP scanning automation library can be found at https://github.com/hmrc/zap-automation

### Troubleshooting
If you are not seeing the consent banner on the test page, check that you have included the `?enableTrackingConsent=true` 
parameters. If you wish to reset behaviour on this page, please clear your cookies.

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
