/*
 * Copyright 2022 HM Revenue & Customs
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

import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}
import support.WithConfiguredApp

class CookieSettingsPageISpec extends AnyWordSpec with Matchers with GuiceOneAppPerSuite {

  override lazy val app: Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"  -> false,
        "auditing.enabled" -> false
      )
    )
    .disable[com.kenshoo.play.metrics.PlayModule]
    .build()

  "Given a running instance of tracking consent frontend, calling GET for cookie-settings" should {
    "return OK with expected page" in {
      val request = FakeRequest(GET, "/tracking-consent/cookie-settings")
      val result  = route(app, request).get

      status(result)        shouldBe OK
      contentType(result)   shouldBe Some("text/html")
      contentAsString(result) should include("Cookie settings on HMRC services")
    }
  }

  "Given a running instance of tracking consent frontend, calling GET with Optimizely configured" should {
    "return OK with expected page with Optimizely snippet" in new WithConfiguredApp {
      val configuration = Map(
        "play.http.router"     -> "testOnlyDoNotUseInAppConf.Routes",
        "optimizely.url"       -> "https://cdn.optimizely.com/js/",
        "optimizely.projectId" -> "a1b2c3d4e5"
      )
      val request       = FakeRequest(GET, "/tracking-consent/cookie-settings")
      val result        = route(appWithConfiguration(configuration), request).get

      status(result)        shouldBe OK
      contentType(result)   shouldBe Some("text/html")
      contentAsString(result) should include("Cookie settings on HMRC services")
      contentAsString(
        result
      )                       should include regex """<script nonce="[a-zA-Z0-9+/=]+" type="text/javascript" src="https://cdn.optimizely.com/js/a1b2c3d4e5.js"></script>"""
    }

    "return a link to the cookie details page when running locally" in {
      val request = FakeRequest(GET, "/tracking-consent/cookie-settings")
      val result  = route(app, request).get

      contentAsString(result) should include("""<a href="http://localhost:9240/help/cookie-details"""")
    }

    "return a link to the cookie details page when running on the platform" in new WithConfiguredApp {
      val configuration = Map(
        "platform.frontend.host" -> "https://www.example.com"
      )

      val request = FakeRequest(GET, "/tracking-consent/cookie-settings")
      val result  = route(appWithConfiguration(configuration), request).get

      contentAsString(result) should include("""<a href="/help/cookie-details"""")
    }
  }
}
