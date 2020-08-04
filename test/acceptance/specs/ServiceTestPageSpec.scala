/*
 * Copyright 2020 HM Revenue & Customs
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

import acceptance.pages.ServiceTestPageFeatureEnabled
import acceptance.pages.ServiceTestPageFeatureEnabled._
import acceptance.pages.ServiceTestPageFeatureDisabled
import org.openqa.selenium.{NoSuchElementException => WebDriverNoSuchElementException}

class ServiceTestPageSpec extends BaseAcceptanceSpec {
  feature("Service Test page") {
    scenario("The user's consent is not initially assumed either way") {
      Given("Given the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page with enable tracking consent parameter")
      go to ServiceTestPageFeatureEnabled

      Then("the dataLayer does not contain the 'hmrc-measurement-allowed' event")
      measurementAllowedGtmEvent should be(null)

      And("the dataLayer does not contain the 'hmrc-marketing-allowed' event")
      marketingAllowedGtmEvent should be(null)

      And("the dataLayer does not contain the 'hmrc-settings-allowed' event")
      settingsAllowedGtmEvent should be(null)
    }

    scenario("The user consenting to all cookies fires GTM") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page with enable tracking consent parameter")
      go to ServiceTestPageFeatureEnabled
      eventually {
        tagName("h2").element.text shouldBe "Tell us whether you accept cookies"
      }

      When("the user clicks 'Accept all cookies'")
      click on acceptAllCookiesButton

      Then("the dataLayer contains the 'hmrc-measurement-allowed' event")
      measurementAllowedGtmEvent should not be (null)

      And("the dataLayer contains the 'hmrc-marketing-allowed' event")
      marketingAllowedGtmEvent should not be (null)

      And("the dataLayer contains the 'hmrc-settings-allowed' event")
      settingsAllowedGtmEvent should not be (null)
    }

    scenario("The user consenting to all cookies sets consent cookie") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page with enable tracking consent parameter")
      go to ServiceTestPageFeatureEnabled

      When("the user clicks 'Accept all cookies'")
      click on acceptAllCookiesButton

      Then("the userConsent cookie is set")
      userConsentCookie.getValue should include("%22preferences%22:{%22acceptAll%22:true}}")
    }

    scenario("The user visits a page without tracking consent enabled") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page without enable tracking consent parameter")
      go to ServiceTestPageFeatureDisabled

      Then("there should be no button 'Accept all cookies'")
      tagName("h2").element.text shouldNot be ("Tell us whether you accept cookies")
      a[WebDriverNoSuchElementException] should be thrownBy acceptAllCookiesButton
    }

    scenario("The user visits a page enables tracking consent enabled via cookie") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page with enable tracking consent parameter")
      go to ServiceTestPageFeatureEnabled

      Then("there should be a button 'Accept all cookies'")
      eventually {
        tagName("h2").element.text shouldBe "Tell us whether you accept cookies"
      }

      And("navigating to a page without the tracking consent parameter should also show the banner")
      go to ServiceTestPageFeatureDisabled
      eventually {
        tagName("h2").element.text shouldBe "Tell us whether you accept cookies"
      }
    }

    scenario("No Javascript errors occur") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page with enable tracking consent parameter")
      go to ServiceTestPageFeatureEnabled

      And("the banner should be displayed with the title 'Tell us whether you accept cookies'")
      eventually {
        tagName("h2").element.text shouldBe "Tell us whether you accept cookies"
      }

      And("no Javascript console errors are thrown")
      consoleErrors should equal (Seq.empty)
    }
  }
}
