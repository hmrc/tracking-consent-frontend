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

package uk.gov.hmrc.trackingconsentfrontend.controllers

import javax.inject.{Inject, Singleton}
import play.api.mvc._
import uk.gov.hmrc.play.bootstrap.frontend.controller.FrontendController
import uk.gov.hmrc.trackingconsentfrontend.config.AppConfig
import uk.gov.hmrc.trackingconsentfrontend.views.html.CookieSettingsPage

import scala.concurrent.Future

@Singleton
class CookieSettingsController @Inject() (
  appConfig: AppConfig,
  mcc: MessagesControllerComponents,
  cookieSettingsPage: CookieSettingsPage
) extends FrontendController(mcc) {

  implicit val config: AppConfig = appConfig

  def cookieSettings(): Action[AnyContent] = Action.async { implicit request =>
    Future.successful(
      Ok(cookieSettingsPage())
    )
  }
}
