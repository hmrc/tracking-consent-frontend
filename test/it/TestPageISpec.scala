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

import org.scalatest.{Matchers, WordSpecLike}
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}
import support.WithConfiguredApp

class TestPageISpec extends WordSpecLike with Matchers {

  "Given a running instance of tracking consent frontend with test routes, calling GET for test-only" should {
    "return OK with expected page" in new WithConfiguredApp {
      val configuration = Map(
        "play.http.router" -> "testOnlyDoNotUseInAppConf.Routes"
      )
      val request = FakeRequest(GET, "/tracking-consent/test-only")
      val result = route(appWithConfiguration(configuration), request).get

      status(result) shouldBe OK
      contentType(result) shouldBe Some("text/html")
      contentAsString(result) should include("Service test page")
    }

    "return OK with expected page without Optimizely if not configured" in new WithConfiguredApp {
      val configuration = Map(
        "play.http.router" -> "testOnlyDoNotUseInAppConf.Routes"
      )
      val request = FakeRequest(GET, "/tracking-consent/test-only")
      val result = route(appWithConfiguration(configuration), request).get

      status(result) shouldBe OK
      contentType(result) shouldBe Some("text/html")
      contentAsString(result) should include("Service test page")
      contentAsString(result) shouldNot include("optimizely")
    }

    "return OK with expected page with Optimizely if enabled via configuration" in new WithConfiguredApp {
      val configuration = Map(
        "play.http.router" -> "testOnlyDoNotUseInAppConf.Routes",
        "optimizely.url" -> "https://cdn.optimizely.com/js/",
        "optimizely.projectId" -> "a1b2c3d4e5"
      )

      val request = FakeRequest(GET, "/tracking-consent/test-only")
      val result = route(appWithConfiguration(configuration), request).get

      status(result) shouldBe OK
      contentType(result) shouldBe Some("text/html")
      contentAsString(result) should include regex """<script nonce="[a-zA-Z0-9+/=]+" type="text/javascript" src="https://cdn.optimizely.com/js/a1b2c3d4e5.js"></script>"""
    }
  }

  "Given a running instance of tracking consent frontend WITHOUT test routes, calling GET for test-only" should {
    "return Not Found" in new WithConfiguredApp {
      val request = FakeRequest(GET, "/tracking-consent/test-only")
      val result = route(appWithConfiguration(Map.empty), request).get

      status(result) shouldBe NOT_FOUND
    }
  }
}
