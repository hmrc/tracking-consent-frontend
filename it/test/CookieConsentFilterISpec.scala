/*
 * Copyright 2025 HM Revenue & Customs
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

package it

import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.mvc.Cookie
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}
import support.WithConfiguredApp

class CookieConsentFilterISpec extends AnyWordSpec with Matchers with GuiceOneAppPerSuite {

  override lazy val app: Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"                      -> false,
        "auditing.enabled"                     -> false,
        "help-frontend.base-url-local-testing" -> "http://localhost:9240"
      )
    )
    .build()

  "Given a running instance of tracking consent frontend, calling any endpoint" should {
    "switch userConsent cookie to httpOnly false if it's true" in new WithConfiguredApp {
      val configuration = Map(
        "platform.frontend.host" -> "https://www.example.com"
      )

      val incorrectCookie = Cookie(name = "userConsent", value = "cookieVal", httpOnly = true)
      val expectedCookie = Cookie(name = "userConsent", value = "cookieVal", maxAge = Some(31556926), httpOnly = false)
      val request = FakeRequest(GET, "/tracking-consent/cookie-settings").withCookies(incorrectCookie)
      val result = route(appWithConfiguration(configuration), request).get

      cookies(result).get("userConsent").get shouldBe expectedCookie
    }

    "switch mdtpurr cookie to httpOnly false if it's true" in new WithConfiguredApp {
      val configuration = Map(
        "platform.frontend.host" -> "https://www.example.com"
      )

      val incorrectCookie = Cookie(name = "mdtpurr", value = "cookieVal", httpOnly = true)
      val expectedCookie = Cookie(name = "mdtpurr", value = "cookieVal", maxAge = Some(31556926), httpOnly = false)
      val request = FakeRequest(GET, "/tracking-consent/cookie-settings").withCookies(incorrectCookie)
      val result = route(appWithConfiguration(configuration), request).get

      cookies(result).get("mdtpurr").get shouldBe expectedCookie
    }
  }
}

