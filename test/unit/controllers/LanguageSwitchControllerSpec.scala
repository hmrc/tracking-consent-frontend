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

package unit.controllers

import com.google.inject.ProvisionException
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneAppPerTest
import play.api.Application
import play.api.http.{HeaderNames, Status}
import play.api.mvc.{AnyContentAsEmpty, Result}
import play.api.test.FakeRequest
import play.api.test.Helpers._
import uk.gov.hmrc.trackingconsentfrontend.controllers.LanguageSwitchController
import unit.AppHelpers

import scala.concurrent.Future

class LanguageSwitchControllerSpec extends PlaySpec with GuiceOneAppPerTest with AppHelpers {
  def makeController(implicit app: Application): LanguageSwitchController = app.injector.instanceOf[LanguageSwitchController]

  def switchToEnglish(implicit app: Application): Future[Result] = makeController.switchToLanguage("en")(fakeRequest)

  def switchToWelsh(implicit app: Application): Future[Result] = makeController.switchToLanguage("cy")(fakeRequest)

  def buildAppWithPlatformFrontendHost[A]: Application =
    buildApp(
      "features.welsh-language-support" -> "true",
      "platform.frontend.host"          -> "https://www.staging.tax.service.gov.uk"
    )

  "LanguageSwitchController" must {
    "return a 303" in {
      val result = switchToEnglish(buildAppWithWelshLanguageSupport())
      status(result) mustBe Status.SEE_OTHER
    }

    "set the PLAY_LANG cookie correctly for Welsh" in {
      val result = switchToWelsh(buildAppWithWelshLanguageSupport())
      cookies(result).get("PLAY_LANG").isDefined mustBe true
      cookies(result).get("PLAY_LANG").get.value mustBe "cy"
    }

    "not set the PLAY_LANG cookie for Welsh if language switching is disabled" in {
      val result = switchToWelsh(buildAppWithWelshLanguageSupport(false))
      cookies(result).get("PLAY_LANG").isDefined mustBe true
      cookies(result).get("PLAY_LANG").get.value mustBe "en"
    }

    "set the PLAY_LANG cookie correctly for English" in {
      val result = switchToEnglish(buildAppWithWelshLanguageSupport())
      cookies(result).get("PLAY_LANG").isDefined mustBe true
      cookies(result).get("PLAY_LANG").get.value mustBe "en"
    }

    "redirect to the REFERER header url as a path only" in {
      implicit val fakeRequestWithReferrer: FakeRequest[AnyContentAsEmpty.type] = fakeRequest.withHeaders(
        HeaderNames.REFERER -> "http://localhost:12345/my-service-page"
      )
      val controller = buildAppWithWelshLanguageSupport().injector.instanceOf[LanguageSwitchController]
      val result     = controller.switchToLanguage("en")(fakeRequestWithReferrer)
      redirectLocation(result) mustBe Some("/my-service-page")
    }

    "redirect to the default url if no REFERER header set" in {
      val controller = buildAppWithWelshLanguageSupport().injector.instanceOf[LanguageSwitchController]
      val result = controller.switchToLanguage("en")(fakeRequest)
      redirectLocation(result) mustBe Some("/tracking-consent/cookie-settings")
    }
  }
}
