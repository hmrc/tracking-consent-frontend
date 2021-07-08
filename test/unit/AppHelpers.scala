/*
 * Copyright 2021 HM Revenue & Customs
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

package unit

import play.api.Application
import play.api.i18n.MessagesApi
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.mvc.Request
import play.api.test.FakeRequest
import uk.gov.hmrc.trackingconsentfrontend.config.AppConfig

trait AppHelpers {
  implicit lazy val fakeRequest = FakeRequest("GET", "/foo")

  def buildApp[A](elems: (String, _)*) =
    new GuiceApplicationBuilder()
      .configure(
        Map(elems: _*) ++ Map(
          "metrics.jvm"      -> false,
          "metrics.enabled"  -> false,
          "auditing.enabled" -> false
        )
      )
      .disable[com.kenshoo.play.metrics.PlayModule]
      .build()

  def buildAppWithWelshLanguageSupport[A](welshLanguageSupport: Boolean = true) =
    buildApp(
      "features.welsh-language-support" -> welshLanguageSupport.toString
    )

  def getAppConfig(implicit app: Application) =
    app.injector.instanceOf[AppConfig]

  def getMessagesApi(implicit app: Application) =
    app.injector.instanceOf[MessagesApi]

  def getMessages(implicit app: Application, request: Request[_]) = {
    val messagesApi: MessagesApi = getMessagesApi(app)
    messagesApi.preferred(request)
  }
}
