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

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import org.scalatest.{Matchers, WordSpecLike}
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class TrackingJsISpec extends WordSpecLike with Matchers with GuiceOneAppPerSuite {

  val materializer: ActorMaterializer = ActorMaterializer()(ActorSystem("it"))

  override lazy val app: Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"  -> false,
        "auditing.enabled" -> false
      )
    )
    .disable[com.kenshoo.play.metrics.PlayModule]
    .build()

  "Given a running instance of tracking consent frontend, calling GET for tracking.js" should {
    "return OK with expected content" in {
      val request = FakeRequest(GET, "/tracking-consent/tracking.js")
      val result = route(app, request).get

      contentType(result) shouldBe Some("application/javascript")
      status(result) shouldBe OK

      val body = result.flatMap(_.body.consumeData(materializer).map(_.utf8String))
      val awaitedBody = Await.result(body, Duration(2, SECONDS))
      awaitedBody should include("\"cookieSettings.title\":\"Cookie settings on HMRC services\"")
    }
  }
}
