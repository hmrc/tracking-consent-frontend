/*
 * Copyright 2021 HM Revenue & Customs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package acceptance.specs

import acceptance.pages.ServiceTestPage
import acceptance.pages.ServiceTestPage._

class ServiceTestPageSpec extends BaseAcceptanceSpec {
  Feature("Service Test page") {
    Scenario("The user's consent is not initially assumed either way") {
      Given("Given the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage

      Then("the dataLayer does not contain the 'trackingConsentMeasurementAccepted' event")
      measurementAllowedGtmEvent should be(null)

      And("the dataLayer does not contain the 'trackingConsentSettingsAccepted' event")
      settingsAllowedGtmEvent should be(null)
    }

    Scenario("The user is initially opted out from Optimizely") {
      Given("Given the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage

      Then("the optimizely object contains the optOut event")
      optimizelyOptOutEvent should not be null

      And("the optimizely object does not contain the optIn event")
      optimizelyOptInEvent should be(null)
    }

    Scenario("The user consenting to all cookies fires GTM") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage
      eventually {
        tagName("h2").element.text shouldBe "Cookies on HMRC services"
      }

      When("the user clicks 'Accept all cookies'")
      click on acceptAdditionalCookiesButton

      Then("the dataLayer contains the 'trackingConsentMeasurementAccepted' event")
      measurementAllowedGtmEvent should not be null

      And("the dataLayer contains the 'trackingConsentSettingsAccepted' event")
      settingsAllowedGtmEvent should not be null
    }

    Scenario("The user consenting to all cookies opts the user into optimizely on the next page load") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage
      eventually {
        tagName("h2").element.text shouldBe "Cookies on HMRC services"
      }

      When("the user clicks 'Accept all cookies'")
      click on acceptAdditionalCookiesButton

      And("refreshes the page")
      reloadPage

      Then("the optimizely object does not contain the optOut event")
      optimizelyOptOutEvent should be(null)

      And("the optimizely object contains the optIn event")
      optimizelyOptInEvent should not be null
    }

    Scenario("The user consenting to all cookies sets consent cookie") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage

      When("the user clicks 'Accept all cookies'")
      click on acceptAdditionalCookiesButton

      Then("the userConsent cookie is set")
      userConsentCookie.getValue should include("%22preferences%22:{%22measurement%22:true%2C%22settings%22:true}}")
    }

    Scenario("The user rejecting additional cookies sets consent cookie") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage

      When("the user clicks 'Accept all cookies'")
      click on rejectAdditionalCookiesButton

      Then("the userConsent cookie is set")
      userConsentCookie.getValue should include("%22preferences%22:{%22measurement%22:false%2C%22settings%22:false}}")
    }

    Scenario("The user rejecting additional cookies does not fire GTM") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage

      When("the user clicks 'Accept all cookies'")
      click on rejectAdditionalCookiesButton

      Then("the dataLayer does not contain the 'trackingConsentMeasurementAccepted' event")
      measurementAllowedGtmEvent should be(null)

      And("the dataLayer does not contain the 'trackingConsentSettingsAccepted' event")
      settingsAllowedGtmEvent should be(null)
    }

    Scenario("The user visits a page and the cookie banner is displayed") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage

      Then("there should be the heading 'Cookies on HMRC services'")
      eventually {
        tagName("h2").element.text shouldBe "Cookies on HMRC services"
      }
    }

    Scenario("No Javascript errors occur") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage

      And("the banner should be displayed with the title 'Cookies on HMRC services'")
      eventually {
        tagName("h2").element.text shouldBe "Cookies on HMRC services"
      }

      And("no Javascript console errors are thrown")
      consoleErrors should equal(Seq.empty)
    }

    // FIXME: Add known issue into sbt-accessibility-linter for the fact that the axe-core algorithm
    // for detecting skip links does not take into account guidance from GDS
    // around the fact that the cookie banner should be rendered *before* the skip link
    ignore("An accessible banner is displayed") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage

      And("the banner should be displayed with the title 'Cookies on HMRC services'")
      eventually {
        tagName("h2").element.text shouldBe "Cookies on HMRC services"
      }

      And("the page is still accessible")
      ServiceTestPage.renderedHtml should passAccessibilityChecks
    }

    // FIXME: Add known issue into sbt-accessibility-linter for the fact that the axe-core algorithm
    // for detecting skip links does not take into account guidance from GDS
    // around the fact that the cookie banner should be rendered *before* the skip link
    ignore("The user consenting to all cookies displays an accessible save confirmation") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ServiceTestPage
      eventually {
        tagName("h2").element.text shouldBe "Cookies on HMRC services"
      }

      When("the user clicks 'Accept all cookies'")
      click on acceptAdditionalCookiesButton

      Then("the page is still accessible")
      ServiceTestPage.renderedHtml should passAccessibilityChecks
    }
  }
}
