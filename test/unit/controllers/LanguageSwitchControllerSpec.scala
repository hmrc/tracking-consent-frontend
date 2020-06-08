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

import play.api.Application
import play.api.http.{HeaderNames, Status}
import play.api.test.Helpers._
import uk.gov.hmrc.trackingconsentfrontend.controllers.LanguageSwitchController
import unit.MixedSpecBase

class LanguageSwitchControllerSpec extends MixedSpecBase {

  def makeController(implicit app: Application) = app.injector.instanceOf[LanguageSwitchController]

  def switchToEnglish(implicit app: Application) = makeController.switchToEnglish()(fakeRequest)

  def switchToWelsh(implicit app: Application) = makeController.switchToWelsh()(fakeRequest)

  "LanguageSwitchController" should {
    "return a 303" in new App(buildAppWithWelshLanguageSupport()) {
      val result = switchToEnglish
      status(result) mustBe Status.SEE_OTHER
    }

    "set the PLAY_LANG cookie correctly for Welsh" in new App(buildAppWithWelshLanguageSupport()) {
      val result = switchToWelsh
      cookies(result).get("PLAY_LANG").isDefined mustBe true
      cookies(result).get("PLAY_LANG").get.value mustBe "cy"
    }

    "not set the PLAY_LANG cookie correctly for Welsh if language switching is disabled" in new App(
      buildAppWithWelshLanguageSupport(false)) {
      val result = switchToWelsh
      cookies(result).get("PLAY_LANG").isDefined mustBe false
    }

    "set the PLAY_LANG cookie correctly for English" in new App(buildAppWithWelshLanguageSupport()) {
      val result = switchToEnglish
      cookies(result).get("PLAY_LANG").isDefined mustBe true
      cookies(result).get("PLAY_LANG").get.value mustBe "en"
    }

    "redirect to the cookie settings page by default" in new App(buildAppWithWelshLanguageSupport()) {
      implicit val fakeRequestWithReferrer = fakeRequest.withHeaders(
        HeaderNames.REFERER -> "/another-page"
      )
      val controller = app.injector.instanceOf[LanguageSwitchController]
      val result =
        controller.switchToEnglish()(fakeRequestWithReferrer)
      redirectLocation(result) mustBe Some("/another-page")
    }
  }
}
