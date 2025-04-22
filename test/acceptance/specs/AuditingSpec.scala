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

import acceptance.pages.{CookieSettingsPage, ServiceTestPage}
import acceptance.pages.ServiceTestPage.*
import acceptance.pages.CookieSettingsPage.*
import com.github.tomakehurst.wiremock.client.WireMock.{anyRequestedFor, anyUrl}
import org.scalatest.concurrent.{Eventually, IntegrationPatience}
import org.scalatest.featurespec.AnyFeatureSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.{BeforeAndAfterEach, GivenWhenThen, Retries}
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import support.{AcceptanceTestServer, WireMockEndpoints}
import uk.gov.hmrc.selenium.webdriver.{Browser, ScreenshotOnFailure}

class AuditingSpec
    extends AnyFeatureSpec
    with GivenWhenThen
    with BeforeAndAfterEach
    with Matchers
    with AcceptanceTestServer
    with Retries
    with Browser
    with Eventually
    with IntegrationPatience
    with ScreenshotOnFailure
    with WireMockEndpoints {

  implicit override lazy val app: Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"                 -> false,
        "auditing.enabled"                -> true,
        "auditing.consumer.baseUri.port"  -> endpointPort,
        "play.http.router"                -> "testOnlyDoNotUseInAppConf.Routes",
        "tracking-consent-frontend.port"  -> port,
        "tracking-consent-frontend.url"   -> "/tracking-consent/tracking.js",
        "tracking-consent-frontend.b-url" -> "/tracking-consent/tracking-b.js"
      )
    )
    .build()

  override def beforeEach(): Unit =
    startBrowser()

  override def afterEach(): Unit =
    quitBrowser()

  Feature("Auditing") {

    Scenario("Accepting all cookies on the cookie settings page sends an auditing event") {
      Given("the user clears their cookies")
      CookieSettingsPage.deleteAllCookies()

      And("the user visits the cookie settings page")
      goToCookieSettingsPage()

      When("the user says yes to all cookies")
      clickUseMeasurementCookies()
      clickUseSettingsCookies()

      And("clicks submit")
      endpointServer.resetRequests()
      clickSubmitButton()

      Then("an audit event is sent")
      eventually {
        val requests = endpointServer.findAll(anyRequestedFor(anyUrl()))
        requests.size                   should be(1)
        requests.get(0).getBodyAsString should include(
          "{\\\"measurement\\\":true,\\\"settings\\\":true}"
        )
      }
    }

    Scenario("The user refusing consent on the cookie settings page sends an auditing event") {
      Given("the user clears their cookies")
      CookieSettingsPage.deleteAllCookies()

      And("the user visits the cookie settings page")
      goToCookieSettingsPage()

      When("the user chooses no for all categories of cookie")
      clickDoNotUseMeasurementCookies()
      clickDoNotUseSettingsCookies()

      And("clicks submit")
      endpointServer.resetRequests()
      clickSubmitButton()

      Then("an audit event is sent")
      eventually {
        val requests = endpointServer.findAll(anyRequestedFor(anyUrl()))
        requests.size                   should be(1)
        requests.get(0).getBodyAsString should include(
          "{\\\"measurement\\\":false,\\\"settings\\\":false}"
        )
      }
    }

    Scenario("Accepting all cookies on the cookie banner sends an audit event") {
      Given("the user clears their cookies")
      ServiceTestPage.deleteAllCookies()

      When("the user visits the service test page")
      goToServiceTestPage()

      When("the user clicks 'Accept all cookies'")
      endpointServer.resetRequests()
      clickAcceptAdditionalCookiesButton()

      Then("an audit event is sent")
      eventually {
        val requests = endpointServer.findAll(anyRequestedFor(anyUrl()))
        requests.size                   should be(1)
        requests.get(0).getBodyAsString should include(
          "{\\\"measurement\\\":true,\\\"settings\\\":true}"
        )
      }
    }
  }
}
