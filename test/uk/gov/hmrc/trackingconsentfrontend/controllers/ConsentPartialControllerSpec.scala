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

package uk.gov.hmrc.trackingconsentfrontend.controllers

import play.api.Application
import play.api.http.Status
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.Helpers._
import uk.gov.hmrc.trackingconsentfrontend.SpecBase

class ConsentPartialControllerSpec extends SpecBase {
  private val controller = app.injector.instanceOf[ConsentPartialController]

  override def fakeApplication(): Application = {
    GuiceApplicationBuilder().configure(Map("cookie-banner.assets-prefix" -> "http://foo:54321")).build()
  }

  "head" must {
    "return 200" in new App() {
      val result = controller.head(fakeRequest)
      status(result) mustBe Status.OK
    }

    "return HTML" in new App() {
      val result = controller.head(fakeRequest)
      contentType(result) mustBe Some("text/html")
      charset(result)     mustBe Some("utf-8")
    }

    "return assets prefixed for local-development" in {
      val result = controller.head(fakeRequest)

      contentAsString(result) must include ("""src="http://foo:54321/tracking-consent/assets/servicePage.js""")
    }
  }
}
