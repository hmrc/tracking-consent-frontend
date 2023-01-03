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

package unit.testonly.views

import play.api.test.Helpers._
import uk.gov.hmrc.trackingconsentfrontend.testonly.views.html.TestPage
import unit.SpecBase

class TestPageSpec extends SpecBase {
  "the test page page" must {
    val testPage = app.injector.instanceOf[TestPage]
    val content  = testPage()

    "display the correct title" in {
      content.select("title").text mustBe "Service test page – GOV.UK"
    }

    "display the correct page heading" in {
      val headers = content.select("h1")
      headers.size mustBe 1
      headers.first.text mustBe "Service test page"
    }

    "inject the correct script" in {
      val scripts = content.select("script")

      scripts.get(0).attr("src") must be("http://localhost:12345/tracking-consent/tracking.js")
    }

    "inject the correct script with the correct gtm container attribute" in {
      val scripts = content.select("script")

      scripts.get(0).attr("data-gtm-container") must be("a")
    }
  }
}
