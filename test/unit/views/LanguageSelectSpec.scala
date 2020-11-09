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

package unit.views

import org.scalatestplus.play.MixedPlaySpec
import play.api.Application
import play.api.mvc.{Cookie, Request}
import play.api.test.FakeRequest
import play.twirl.api.Html
import uk.gov.hmrc.trackingconsentfrontend.config.AppConfig
import uk.gov.hmrc.trackingconsentfrontend.views.html.components.LanguageSelect
import unit.{AppHelpers, JsoupHelpers}

class LanguageSelectSpec extends MixedPlaySpec with JsoupHelpers with AppHelpers {

  def languageSelectContent(implicit app: Application, request: Request[_]) = {
    implicit val appConfig: AppConfig = getAppConfig
    implicit val messages             = getMessages(app, request)
    val languageSelect                = app.injector.instanceOf[LanguageSelect]
    languageSelect()
  }

  "LanguageSelect" must {
    "Return nothing if language support is disabled" in new App(buildAppWithWelshLanguageSupport(false)) {
      val content = languageSelectContent

      content mustBe Html("")
    }

    "Return a language select" in new App(buildAppWithWelshLanguageSupport(true)) {
      val content = languageSelectContent

      content.select(".hmrc-language-select") must have size 1
    }

    "Provide a link to Welsh by default" in new App(buildAppWithWelshLanguageSupport(true)) {
      val content = languageSelectContent

      content
        .select(".govuk-link")
        .text mustBe "Newid yr iaith ir Gymraeg Cymraeg"
    }

    "Provide a link to English is language cookie is set to Welsh" in new App(buildAppWithWelshLanguageSupport(true)) {
      implicit val fakeRequest =
        FakeRequest("GET", "/foo").withCookies(Cookie("PLAY_LANG", "cy"))
      val content              = languageSelectContent

      content
        .select(".govuk-link")
        .text mustBe "Change the language to English English"
    }
  }
}
