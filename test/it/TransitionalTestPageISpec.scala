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

package it

import org.scalatest.{Matchers, TestSuite, WordSpecLike}
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}

class TransitionalTestPageISpec extends WordSpecLike with Matchers {

  "Given a running instance of tracking consent frontend with test routes, calling GET for test-only-transitional" should {
    "return OK with expected page" in new EnabledTestRoutesApp {
      val request = FakeRequest(GET, "/tracking-consent/test-only-transitional")
      val result  = route(app, request).get

      status(result)        shouldBe OK
      contentType(result)   shouldBe Some("text/html")
      contentAsString(result) should include("Transitional service test page")
    }
  }

  trait EnabledTestRoutesApp extends TestSuite with GuiceOneAppPerSuite {
    override lazy val app: Application = new GuiceApplicationBuilder()
      .configure(
        Map(
          "metrics.enabled"  -> false,
          "auditing.enabled" -> false,
          "play.http.router" -> "testOnlyDoNotUseInAppConf.Routes"
        )
      )
      .disable[com.kenshoo.play.metrics.PlayModule]
      .build()
  }
}
