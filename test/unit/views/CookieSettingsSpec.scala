/*
 * Copyright 2021 HM Revenue & Customs
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

import play.api.test.Helpers._
import uk.gov.hmrc.trackingconsentfrontend.views.html.CookieSettingsPage
import unit.SpecBase

class CookieSettingsSpec extends SpecBase {
  "the cookie settings page" must {
    val cookieSettingsPage = app.injector.instanceOf[CookieSettingsPage]
    val content            = cookieSettingsPage()

    "should pass accessibility checks" in {
      content.toString() must passAccessibilityChecks
    }

    "display the correct browser title" in {
      content.select("title").text mustBe "Cookie settings on HMRC services – GOV.UK"
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

    "include the optimizely script" in {
      val scripts = content.select("script")
      scripts.get(2).attr("src") must be("/tracking-consent/assets/optimizely.js")
    }

    "return a link to the cookie details page when running locally" in {
      val cookieDetailsLinks = content.select("a[href=http://localhost:9240/help/cookie-details]")

      cookieDetailsLinks            must have size 2
      cookieDetailsLinks.first.text must include("Find out more about cookies on HMRC services")
    }
  }
}
