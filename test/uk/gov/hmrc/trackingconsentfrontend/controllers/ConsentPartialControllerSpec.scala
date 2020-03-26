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

import org.scalatest.{Matchers, WordSpec}
import org.scalatestplus.play.{MixedFixtures, MixedPlaySpec}
import play.api.Application
import play.api.http.Status
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.FakeRequest
import play.api.test.Helpers._

class ConsentPartialControllerSpec extends MixedPlaySpec {

  def buildApp[A](elems: (String, String)*): Application =
    GuiceApplicationBuilder()
      .configure(Map(elems: _*))
      .build()

  def makeRequest(app: Application) = {
    val fakeRequest = FakeRequest("GET", "/")
    val controller = app.injector.instanceOf[ConsentPartialController]
    controller.head(fakeRequest)
  }

  "head" must {
    "return 200" in new App() {
      val result = makeRequest(app)
      status(result) mustBe Status.OK
    }

    "return HTML" in new App() {
      val result = makeRequest(app)
      contentType(result) mustBe Some("text/html")
      charset(result)     mustBe Some("utf-8")
    }

    "return assets prefixed for local-development" in new App(buildApp("cookie-banner.assets-prefix" -> "http://localhost:12345")) {
      val result = makeRequest(app)
      contentAsString(result) must include ("""src="http://localhost:12345/tracking-consent/assets/servicePage.js""")
    }
  }
}
