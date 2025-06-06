# Maintaining tracking-consent-frontend

## Requirements

* [Node.js](https://nodejs.org/en/) `>= 12.13.1`

To install multiple versions of Node.js, you may find it easier to use a node version manager:

* [nvm](https://github.com/creationix/nvm)

## To run locally

To run the application locally with the test-only endpoints enabled,

```
./run-with-test-endpoints.sh
```

The cookie banner should be available at http://localhost:12345/tracking-consent/test-only

Any changes to the Scala or Javascript should trigger a rebuild.

To run the application without test routes enabled, simply do,

```
sbt run
```

## Running all Scala and Javascript unit and integration tests together

```
sbt test it/test
```

The above tests include accessibility checks via the
[sbt-accessibility-linter](https://www.github.com/hmrc/sbt-accessibility-linter)
plugin.

## Running UI journey tests

The UI journey tests are located in the [accessibility-statement-frontend-ui-tests](https://github.com/hmrc/accessibility-statement-frontend-ui-tests). Running these locally or in 
Jenkins will also run the accessibility assessment via [ui-test-runner](https://github.com/hmrc/ui-test-runner).

There is a single acceptance test for end-to-end testing of Javascript events triggering auditing, using `ui-test-runner`
and WireMock. To test on your local machine, run the test with:
```
./run_acceptance_tests.sh 
```

## Running just the Javascript checks

Change to the Javascript assets directory:

```
cd js
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

To run the ZAP scan, use  `dast-config-manager` and follow the instructions:
[Running ZAP locally](https://github.com/hmrc/dast-config-manager?tab=readme-ov-file#running-zap-locally)

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
npm run build 
npm run backstop
```
> ⚠️ **If you are using Linux**: Ensure port 8888 is open - In Ubuntu you can do this with `sudo ufw allow 8888`.
> You may want to `sudo ufw deny 8888` after.

On completion, Backstop will emit the results as an HTML report in backstop_data/html_report  If a failure is the
result of a known change to the component, the reference images can be updated by running,

```shell script
npm run backstop:approve
```

If any changes are needed to the backstop configuration, for example to test on different device types or add to the
 list of scenarios, these can be made by editing the file `test/backstop/backstopConfig.js`

## NPM versions and security

Modules pulled from npm are pinned in the file packages.json. These are pinned to prevent 
security vulnerabilities making it into production code via auto-update. If you wish to 
upgrade a specific dependency, please discuss the implications with the platform security team.

### Adding or updating NPM dependencies

To minimise the security risk from accidentally installing a compromised package, you should:

- Use the `--ignore-scripts` parameter when installing to prevent the package from executing scripts during installation. This can't be configured automatically in the repo because it would disable our ability to run any scripts (even the top-level ones in the project)

- Run `npm run audit` post installation to check for vulnerabilities after installing before running a build or test using it

  > **Note**
  > Deliberately compromised packages tend to be quickly removed from NPM once they are discovered, but a removed package might be present in a cache somewhere so for safety we should always run this check.

- Carefully consider if new dependencies are really needed, and try to avoid adding them whenever possible

## Cookie banner

The cookie banner is a Javascript implementation of the [GOV.UK cookie banner component](https://design-system.service.gov.uk/components/cookie-banner/),
first released in v3.11.0 of alphagov/govuk-frontend.

The design takes into consideration the following requirements:
1. it must work in conjunction with multiple frontend versions including those based on assets-frontend and 
 classic services
1. it must not assume any styles exist in the consuming service
1. it must not override any styles that exist in the consuming service
1. it should make integrating with tracking consent as simple as possible (e.g. single line code change)
1. it should minimise the bundle size for tracking consent

These constraints led to a self-contained Javascript-based solution that makes use of webpack's 
[styleloader](https://webpack.js.org/loaders/style-loader/) to inject the styles needed by the cookie banner directly 
into the DOM. Consequently, integrating with tracking consent involves the addition of a single script tag into 
 the HEAD and does not rely on any styles existing in the consuming service.
 
In order to satisfy requirement 3, the govuk-frontend styles have been prefixed with `cbanner-`. As govuk-frontend does 
not support prefixing in this way, it was necessary to copy some of the govuk-frontend modules into tracking-consent-frontend.
Where possible, mixins and variables are imported rather than copied.

Requirement 5 is achieved by only importing modules and styles actually used by the cookie banner i.e. button, button group, 
cookie banner and required layout styles.

### Use of `HmrcTrackingConsentFrontendSnippet` from `play-frontend-hmrc`
The advised solution for adding the tracking banner is to enable `HmrcTrackingConsentFrontendSnippet` from `play-frontend-hmrc`
by adding the configuration `tracking-consent-frontend { gtm.container = "a" }` (or other container.)

This won't work for the pages hosted within `tracking-consent-frontend` because the above configuration will inject the
banner to ALL pages within a service. However, `tracking-consent-frontend` contains the `CookieSettingsPage.scala.html`
which requires a different Javascript file (`settingsPage.js`) to be called in the GTM snippet.

This is why all pages in `tracking-consent-frontend` use a snippet within the service, rather than the `play-frontend-hmrc`
library version.

### Upgrading to new versions of govuk-frontend

1. Change to the Javascript assets directory

    ```shell script
    cd js
    ```

1. Upgrade the version of govuk-frontend in `package.json`
1. Copy in new versions of the following modules:
   * _button.scss
   * _button-group.scss
   * _cookie-banner.scss
   * _typography.scss
   * _width-container.scss
1. Prefix all selectors starting with `.govuk-` as `.cbanner-govuk-`
1. Re-run the Backstop VRT tests:
    ```shell script
    npm run backstop
    ```

1. Approve any VRT changes with:

    ```shell script
    npm run backstop:approve
    ```
 
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
