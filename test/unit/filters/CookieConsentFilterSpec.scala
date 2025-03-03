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

package unit.filters

import play.api.test.Helpers.defaultAwaitTimeout
import play.api.mvc.Results.Ok
import play.api.test.FakeRequest
import play.api.mvc.{Cookie, DefaultActionBuilder, EssentialAction}
import play.api.test.Helpers.cookies
import uk.gov.hmrc.trackingconsentfrontend.filters.CookieConsentFilter
import unit.SpecBase

import scala.concurrent.ExecutionContext

class CookieConsentFilterSpec extends SpecBase {

  val cookieConsentFilter = new CookieConsentFilter()(ExecutionContext.global)

  implicit lazy val Action: DefaultActionBuilder = app.injector.instanceOf(classOf[DefaultActionBuilder])

  "CookieConsentFilter" should {
    "modify userConsent cookie" when {
      "cookie is httpOnly and max age is defined" in {
        val incorrectCookie = Cookie(name = "userConsent", value = "cookieVal", maxAge = Some(100), httpOnly = true)
        val expectedCookie = Cookie(name = "userConsent", value = "cookieVal", maxAge = Some(100), httpOnly = false)
        val request = FakeRequest().withCookies(incorrectCookie)
        val action: EssentialAction = Action(_ => Ok("success"))

        val result = cookieConsentFilter.apply(action)(request).run()

        cookies(result).head mustBe expectedCookie
      }

      "cookie is httpOnly and max age is not defined" in {
        val incorrectCookie = Cookie(name = "userConsent", value = "cookieVal", httpOnly = true)
        val expectedCookie = Cookie(name = "userConsent", value = "cookieVal", maxAge = Some(31556926), httpOnly = false)
        val request = FakeRequest().withCookies(incorrectCookie)
        val action: EssentialAction = Action(_ => Ok("success"))

        val result = cookieConsentFilter.apply(action)(request).run()

        cookies(result).head mustBe expectedCookie
      }
    }

    "modify mdtpurr cookie" when {
      "cookie is httpOnly and max age is defined" in {
        val incorrectCookie = Cookie(name = "mdtpurr", value = "cookieVal", maxAge = Some(100), httpOnly = true)
        val expectedCookie = Cookie(name = "mdtpurr", value = "cookieVal", maxAge = Some(100), httpOnly = false)
        val request = FakeRequest().withCookies(incorrectCookie)
        val action: EssentialAction = Action(_ => Ok("success"))

        val result = cookieConsentFilter.apply(action)(request).run()

        cookies(result).head mustBe expectedCookie
      }

      "cookie is httpOnly and max age is not defined" in {
        val incorrectCookie = Cookie(name = "mdtpurr", value = "cookieVal", httpOnly = true)
        val expectedCookie = Cookie(name = "mdtpurr", value = "cookieVal", maxAge = Some(31556926), httpOnly = false)
        val request = FakeRequest().withCookies(incorrectCookie)
        val action: EssentialAction = Action(_ => Ok("success"))

        val result = cookieConsentFilter.apply(action)(request).run()

        cookies(result).head mustBe expectedCookie
      }
    }
  }
}
