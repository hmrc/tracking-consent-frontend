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

package uk.gov.hmrc.trackingconsentfrontend

import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.scalatestplus.play.MixedPlaySpec
import play.api.Application
import play.api.i18n.MessagesApi
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.mvc.Request
import play.api.test.FakeRequest
import play.twirl.api.Html
import uk.gov.hmrc.trackingconsentfrontend.config.AppConfig

trait MixedSpecBase extends MixedPlaySpec with JsoupHelpers {
  implicit lazy val fakeRequest = FakeRequest("GET", "/foo")

  def getMessages(implicit app: Application, request: Request[_]) = {
    val messagesApi: MessagesApi = app.injector.instanceOf[MessagesApi]
    messagesApi.preferred(request)
  }

  def getAppConfig(implicit app: Application) = {
    app.injector.instanceOf[AppConfig]
  }

  def asDocument(html: Html): Document = Jsoup.parse(html.toString())

  def buildApp[A](elems: (String, _)*) = new GuiceApplicationBuilder()
       .configure(Map(elems:_*))
       .build()

  def buildAppWithWelshLanguageSupport[A](welshLanguageSupport: Boolean = true) =
    buildApp(
      "features.welsh-language-support" -> welshLanguageSupport.toString)
}
