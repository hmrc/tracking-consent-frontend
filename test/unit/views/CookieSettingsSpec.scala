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

package unit.views

import play.api.test.Helpers.*
import uk.gov.hmrc.trackingconsentfrontend.views.html.CookieSettingsPage
import unit.SpecBase

class CookieSettingsSpec extends SpecBase {
  "the cookie settings page" must {
    val cookieSettingsPage = app.injector.instanceOf[CookieSettingsPage]
    val content            = cookieSettingsPage()

    "display the correct browser title" in {
      content.select("title").first().text mustBe "Cookie settings on HMRC services – GOV.UK"
    }

    "display the correct page heading" in {
      val headers = content.select("h1")
      headers.size mustBe 1
      headers.first.text mustBe "Cookie settings on HMRC services"
    }

    "return the introductory content" in {
      contentAsString(content) must include("‘Cookies’ are files saved on your phone")
    }

    "return the content for unsupported browsers" in {
      contentAsString(content) must include("Javascript is not running on your browser")
    }

    "return the content for supported browsers" in {
      contentAsString(content) must include("Cookies that measure")
    }

    "initially hide the content for supported browsers" in {
      content.select(".cookie-settings__body--browser-supported") must have size 0
    }

    "include the measurement radio inputs" in {
      content.select("input[name=measurement]") must have size 2
    }

    "include the settings radio inputs" in {
      content.select("input[name=settings]") must have size 2
    }

    "return a link to the cookie details page" in {
      val cookieDetailsLinks = content.select("a[href=/help/cookie-details]")

      cookieDetailsLinks            must have size 2
      cookieDetailsLinks.first.text must include("Find out more about cookies on HMRC services")
    }
  }
}
