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

package unit.controllers

import org.jsoup.Jsoup
import play.api.http.Status
import play.api.test.FakeRequest
import play.api.test.Helpers._
import uk.gov.hmrc.trackingconsentfrontend.controllers.CookieSettingsController
import unit.SpecBase

class CookieSettingsControllerSpec extends SpecBase {
  private val controller = app.injector.instanceOf[CookieSettingsController]

  "cookie_settings" should {
    "return 200" in {
      val result = controller.cookieSettings(None)(fakeRequest)
      status(result) mustBe Status.OK
    }

    "return 200 if feature toggle enabled via querystring" in {
      val fakeWithoutToggleRequest = FakeRequest("GET", "/foo")

      val result = controller.cookieSettings(Some("true"))(fakeWithoutToggleRequest)
      status(result) mustBe Status.OK
    }

    "set the enableTrackingConsent cookie if enabled via querystring" in {
      val fakeWithoutToggleRequest = FakeRequest("GET", "/foo")

      val result = controller.cookieSettings(Some("true"))(fakeWithoutToggleRequest)
      cookies(result).get("enableTrackingConsent").exists(_.value == "true") mustBe true
    }

    "set the enableTrackingConsent cookie as a client-side cookie, if enabled via querystring" in {
      val fakeWithoutToggleRequest = FakeRequest("GET", "/foo")

      val result = controller.cookieSettings(Some("true"))(fakeWithoutToggleRequest)
      cookies(result).get("enableTrackingConsent").exists(_.httpOnly == false) mustBe true
    }

    "return 404 if feature toggle not enabled" in {
      val fakeRequest = FakeRequest("GET", "/foo")
      val result = controller.cookieSettings(None)(fakeRequest)
      status(result) mustBe Status.NOT_FOUND
    }

    "return the correct 404 page content if the feature toggle is not enabled" in {
      val fakeWithoutToggleRequest = FakeRequest("GET", "/foo")
      val result = controller.cookieSettings(None)(fakeWithoutToggleRequest)
      val content = Jsoup.parse(contentAsString(result))

      val headers = content.select("h1")
      headers.size mustBe 1
      headers.first.text mustBe "This page can’t be found"
    }

    "return HTML" in {
      val result = controller.cookieSettings(None)(fakeRequest)
      contentType(result) mustBe Some("text/html")
      charset(result)     mustBe Some("utf-8")
    }

    "show the correct title" in {
      val result = controller.cookieSettings(None)(fakeRequest)
      contentAsString(result) must include ("Cookie settings on HMRC services")
    }
  }
}
