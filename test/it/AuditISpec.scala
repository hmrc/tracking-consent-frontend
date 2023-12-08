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

import org.scalatest.AppendedClues
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.FakeRequest
import play.api.test.Helpers._

class AuditISpec extends AnyWordSpec with Matchers with AppendedClues with GuiceOneAppPerSuite {

  override lazy val app: Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"                  -> false,
        "auditing.enabled"                 -> false,
        "play.filters.cors.allowedOrigins" -> List(
          "https://www.tax.service.gov.uk",
          "https://developer.service.hmrc.gov.uk"
        )
      )
    )
    .build()

  "Given a running instance of tracking consent frontend, calling POST /audit" should {
    "return OK with no content when Origin is allowed" in {
      List("https://www.tax.service.gov.uk", "https://developer.service.hmrc.gov.uk") foreach { allowedOrigin =>
        val request = FakeRequest(POST, "/tracking-consent/audit").withHeaders(("Origin", allowedOrigin))
        val result  = route(app, request).get

        status(result)          shouldBe OK withClue s"for Origin $allowedOrigin"
        contentType(result)     shouldBe None
        contentAsString(result) shouldBe ""
      }
    }

    "return FORBIDDEN when Origin is not allowed" in {
      val request =
        FakeRequest(POST, "/tracking-consent/audit").withHeaders(("Origin", "https://www.bad.service.gov.uk"))
      val result  = route(app, request).get

      status(result) shouldBe FORBIDDEN
    }
  }
}
