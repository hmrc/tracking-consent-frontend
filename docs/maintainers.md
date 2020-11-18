# Maintaining tracking-consent-frontend

## Requirements

* [Node.js](https://nodejs.org/en/) `>= 12.13.1`

To install multiple versions of Node.js, you may find it easier to use a node version manager:

* [nvm](https://github.com/creationix/nvm)

## To run locally

To run the application locally with the test-only endpoints enabled,

```
./run.sh
```

The cookie banner should be available at http://localhost:12345/tracking-consent/test-only?enableTrackingConsent=true

If you do not initially include the `?enableTrackingConsent=true` section of the URL, the consent banner will not be displayed.

Once you have visited the page with `?enableTrackingConsent=true` once, a cookie will be set to enable the banner functionality on 
all future pages until the cookie is cleared.

Any changes to the Scala or Javascript should trigger a rebuild.

To run the application without test routes enabled, simply do,

```
sbt run
```

## Running all Scala and Javascript unit and integration tests together

```
sbt test it:test
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

You will also need to install additional active and passive scanner rules from https://github.com/zaproxy/zap-extensions
by following the instructions in the README.

```
./run_zap_tests.sh
```

More information on HMRC's ZAP scanning automation library can be found at https://github.com/hmrc/zap-automation

## Visual regression tests

We are using [backstopJS](https://github.com/garris/BackstopJS) to perform visual regression testing. This renders 
the cookie banner in a headless Chrome browser and compares against known references. 

We are validating that the cookie banner renders correctly when injected into a service based on:
* govuk-frontend v3.8.1
* assets-frontend v3.12.0 and hmrc/govuk-template v5.56.0
* Classic services

The reference images are stored in `test/backstop/backstop_data/bitmaps_reference` in the Javascript directory.

To run the tests locally, you will need [Docker Desktop](https://www.docker.com/products/docker-desktop). 
This is because there are subtle differences in rendering between platforms and we want the results to be 
consistent with CI. To run the tests,

```shell script
npm run backstop
```

On completion, Backstop will emit the results as an HTML report in backstop_data/html_report  If a failure is the
result of a known change to the component, the reference images can be updated by running,

```shell script
npm run backstop:approve
```

If any changes are needed to the backstop configuration, for example to test on different device types or add to the
 list of scenarios, these can be made by editing the file `test/backstop/backstopConfig.js`

### NPM versions and security

Modules pulled from npm are pinned in the file packages.json. These are pinned to prevent 
security vulnerabilities making it into production code via auto-update. If you wish to 
upgrade a specific dependency, please discuss the implications with the platform security team.

## Architectural decision records 

We are using MADRs to record architecturally significant decisions in this service. To find out more
visit [MADR](https://github.com/adr/madr)

See our [architectural decision log](adr/index.md) (ADL) for a list of past decisions.

## How to create a new ADR

1. Install [Node](https://nodejs.org/en/download/) if you do not have this already. Node includes
npm.

1. Install `adr-log` if you do not have this already

    ```shell script
    npm install -g adr-log
    ```

1. Copy [template.md](adr/template.md) as NNNN-title-of-decision.md, and fill
in the fields. Do not feel you have to fill in all the fields, only fill in fields
that are strictly necessary. Some decisions will merit more detail than others.

1. To re-generate the table of contents, run

    ```shell script
    ./generate-adl.sh
    ```
