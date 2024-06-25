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

package it

import org.apache.pekko.actor.ActorSystem
import org.apache.pekko.stream.Materializer
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.*

class TrackingJsISpec extends AnyWordSpec with Matchers with GuiceOneAppPerSuite {

  val materializer: Materializer = Materializer(ActorSystem("it"))

  override lazy val app: Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"  -> false,
        "auditing.enabled" -> false
      )
    )
    .build()

  "Given a running instance of tracking consent frontend, calling GET for tracking.js" should {
    "return OK with expected content" in {
      val request = FakeRequest(GET, "/tracking-consent/tracking.js")
      val result  = route(app, request).get

      contentType(result) shouldBe Some("application/javascript")
      status(result)      shouldBe OK

      val body        = result.flatMap(_.body.consumeData(materializer).map(_.utf8String))
      val awaitedBody = Await.result(body, Duration(2, SECONDS))
      awaitedBody should include("\"cookieSettings.title\":\"Cookie settings on HMRC services – GOV.UK\"")
    }
  }
}
