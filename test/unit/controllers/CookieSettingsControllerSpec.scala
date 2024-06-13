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

package unit.controllers

import play.api.http.Status
import play.api.mvc.Cookie
import play.api.test.Helpers.*
import uk.gov.hmrc.trackingconsentfrontend.controllers.CookieSettingsController
import unit.SpecBase

class CookieSettingsControllerSpec extends SpecBase {
  private val controller = app.injector.instanceOf[CookieSettingsController]

  "cookie_settings" should {
    "return 200" in {
      val result = controller.cookieSettings()(fakeRequest)
      status(result) mustBe Status.OK
    }

    "return HTML" in {
      val result = controller.cookieSettings()(fakeRequest)
      contentType(result) mustBe Some("text/html")
      charset(result) mustBe Some("utf-8")
    }

    "show the correct title" in {
      val result = controller.cookieSettings()(fakeRequest)
      contentAsString(result) must include("Cookie settings on HMRC services")
    }

    "return the page with expected Welsh translations if enabled" in {
      val requestWithLanguageCookie = fakeRequest.withCookies(Cookie("PLAY_LANG", "cy"))
      val result                    = controller.cookieSettings()(requestWithLanguageCookie)
      contentAsString(result) must include("Gosodiadau cwcis ar wasanaethau CThEF")
    }
  }
}
