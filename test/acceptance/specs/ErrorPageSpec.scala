/*
 * Copyright 2022 HM Revenue & Customs
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

import acceptance.pages.ErrorPage
import acceptance.pages.ErrorPage._

class ErrorPageSpec extends BaseAcceptanceSpec {
  Feature("Error page") {

    Scenario("GTM is loaded into the page with the default container") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits a non-existent page")
      go to ErrorPage

      Then("the gtm script is injected into the page")
      eventually {
        gtmScript should not be null
      }
    }

    Scenario("The dataLayer is initialised") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits a non-existent page")
      go to ErrorPage

      Then("the dataLayer contains the Window loaded event")
      eventually {
        windowLoadedGtmEvent should not be null
      }
    }

    Scenario("The page has the correct title") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits a non-existent page")
      go to ErrorPage

      Then("the title should be visible")
      h1Element.getText should be(title)
    }

    Scenario("The user sees the cookie banner") {
      Given("the user clears their cookies")
      deleteAllCookies

      When("the user visits the service test page")
      go to ErrorPage

      Then("the cookie banner is visible")
      eventually {
        acceptAdditionalCookiesButton should not be null
      }
    }
  }
}
