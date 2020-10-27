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

import acceptance.pages.{CookieSettingsPage, ServiceTestPageFeatureEnabled}
import acceptance.pages.ServiceTestPageFeatureEnabled._
import acceptance.pages.CookieSettingsPage.{doNotUseMarketingCookiesLabel, doNotUseMeasurementCookiesLabel, doNotUseSettingsCookiesLabel, submitButton, useMarketingCookiesLabel, useMeasurementCookiesLabel, useSettingsCookiesLabel}
import acceptance.specs.tags.Local
import com.github.tomakehurst.wiremock.client.WireMock.{anyRequestedFor, anyUrl}
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import support.WireMockEndpoints

class AuditingSpec extends BaseAcceptanceSpec with WireMockEndpoints {
  implicit override lazy val app: Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"                            -> false,
        "auditing.enabled"                           -> true,
        "auditing.consumer.baseUri.port"             -> endpointPort,
        "play.http.router"                           -> "testOnlyDoNotUseInAppConf.Routes",
        "tracking-consent-frontend.port"             -> port,
        "tracking-consent-frontend.url"              -> "/tracking-consent/tracking.js",
        "tracking-consent-frontend.transitional-url" -> "/tracking-consent/tracking-transitional.js"
      )
    )
    .disable[com.kenshoo.play.metrics.PlayModule]
    .build()

  scenario("Accepting all cookies on the cookie settings page sends an auditing event", Local) {
    Given("the user clears their cookies")
    deleteAllCookies

    And("the user visits the cookie settings page")
    go to CookieSettingsPage

    When("the user says yes to all cookies")
    click on useMeasurementCookiesLabel
    click on useMarketingCookiesLabel
    click on useSettingsCookiesLabel

    And("clicks submit")
    endpointServer.resetRequests()
    click on submitButton

    Then("an audit event is sent")
    eventually {
      val requests = endpointServer.findAll(anyRequestedFor(anyUrl()))
      requests.size should be(1)
      requests.get(0).getBodyAsString should include(
        "{\\\"measurement\\\":true,\\\"marketing\\\":true,\\\"settings\\\":true}")
    }
  }

  scenario("The user refusing consent on the cookie settings page sends an auditing event", Local) {
    Given("the user clears their cookies")
    deleteAllCookies

    And("the user visits the cookie settings page")
    go to CookieSettingsPage

    When("the user chooses no for all categories of cookie")
    click on doNotUseMeasurementCookiesLabel
    click on doNotUseMarketingCookiesLabel
    click on doNotUseSettingsCookiesLabel

    And("clicks submit")
    endpointServer.resetRequests()
    click on submitButton

    Then("an audit event is sent")
    eventually {
      val requests = endpointServer.findAll(anyRequestedFor(anyUrl()))
      requests.size should be(1)
      requests.get(0).getBodyAsString should include(
        "{\\\"measurement\\\":false,\\\"marketing\\\":false,\\\"settings\\\":false}")
    }
  }

  scenario("Accepting all cookies on the cookie banner sends an audit event", Local) {
    Given("the user clears their cookies")
    deleteAllCookies

    When("the user visits the service test page with enable tracking consent parameter")
    go to ServiceTestPageFeatureEnabled

    When("the user clicks 'Accept all cookies'")
    endpointServer.resetRequests()
    click on acceptAllCookiesButton

    Then("an audit event is sent")
    eventually {
      val requests = endpointServer.findAll(anyRequestedFor(anyUrl()))
      requests.size should be(1)
      requests.get(0).getBodyAsString should include(
        "{\\\"measurement\\\":true,\\\"marketing\\\":true,\\\"settings\\\":true}")
    }
  }
}
