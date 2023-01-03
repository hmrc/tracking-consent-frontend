/*
 * Copyright 2023 HM Revenue & Customs
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

import acceptance.pages.LegacyServiceTestPage
import acceptance.pages.LegacyServiceTestPage._
import org.scalatest.tagobjects.Retryable

class LegacyTestPageSpec extends BaseAcceptanceSpec {
  Feature("Legacy Service Test page") {
    Scenario("No Javascript errors occur", Retryable) {
      Given("the user clears their cookies")
      deleteAllCookies()

      When("the user visits the legacy service test page")
      go to LegacyServiceTestPage

      Then("the banner should be displayed with the title 'Cookies on HMRC services'")
      eventually {
        tagName("h2").element.text shouldBe "Cookies on HMRC services"
      }

      And("no Javascript console errors are thrown")
      consoleErrors should equal(Seq.empty)
    }
  }
}
