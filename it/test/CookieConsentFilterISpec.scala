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

import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.libs.ws.WSClient
import play.api.test.Helpers._


class CookieConsentFilterISpec extends PlaySpec with GuiceOneServerPerSuite {

  override def fakeApplication(): Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"                      -> false,
        "auditing.enabled"                     -> false,
        "help-frontend.base-url-local-testing" -> "http://localhost:9240"
      )
    )
    .build()

  val wsClient = app.injector.instanceOf[WSClient]
  val testUrl = s"http://localhost:$port/tracking-consent/cookie-settings"

  "Given a running instance of tracking consent frontend, calling cookie-settings endpoint" should {
    "switch userConsent cookie to httpOnly false if it's true" in {
      val response = await(wsClient.url(testUrl).addHttpHeaders(("Cookie", "userConsent=cookieVal")).get())
      val cookie = response.headerValues("Set-Cookie").filter(_.contains("userConsent")).toString

      cookie mustNot include("HTTPOnly")
      cookie must include("Max-Age=31556926")
    }

    "switch mdtpurr cookie to httpOnly false if it's true" in {
      val response = await(wsClient.url(testUrl).addHttpHeaders(("Cookie", "mdtpurr=cookieVal")).get())
      val cookie = response.headerValues("Set-Cookie").filter(_.contains("mdtpurr")).toString

      cookie mustNot include("HTTPOnly")
      cookie must include("Max-Age=31556926")
    }

    "does not affect other cookies" in {
      val response = await(wsClient.url(testUrl).addHttpHeaders(("Cookie", "otherCookie=cookieVal")).get())
      val cookie = response.headerValues("Set-Cookie").filter(_.contains("otherCookie"))

      cookie mustBe empty
    }
  }
}

