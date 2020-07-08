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

package uk.gov.hmrc.trackingconsentfrontend.controllers

import javax.inject.{Inject, Singleton}
import play.api.mvc._
import uk.gov.hmrc.play.bootstrap.frontend.controller.FrontendController
import uk.gov.hmrc.trackingconsentfrontend.config.AppConfig
import uk.gov.hmrc.trackingconsentfrontend.views.html.CookieSettingsPage
import uk.gov.hmrc.trackingconsentfrontend.views.html.NotFoundPage

import scala.concurrent.Future

@Singleton
class CookieSettingsController @Inject()(
  appConfig: AppConfig,
  mcc: MessagesControllerComponents,
  cookieSettingsPage: CookieSettingsPage,
  notFoundPage: NotFoundPage)
    extends FrontendController(mcc) {

  implicit val config: AppConfig = appConfig

  private val featureCookieName   = appConfig.featureCookieName
  private val featureEnabledValue = appConfig.featureEnabledValue
  private val featureToggleCookie = Cookie(name = featureCookieName, value = featureEnabledValue, httpOnly = false)

  private def isFeatureCookieSet(implicit request: Request[_]) =
    request.cookies
      .get(featureToggleCookie.name)
      .exists(_.value == featureToggleCookie.value)

  def cookieSettings(enableTrackingConsent: Option[String] = None): Action[AnyContent] = Action.async {
    implicit request =>
      val isFeatureParameterSet = enableTrackingConsent.contains(featureEnabledValue)

      if (isFeatureParameterSet || isFeatureCookieSet) {
        Future.successful(
          Ok(cookieSettingsPage())
            .withCookies(featureToggleCookie)
        )
      } else {
        Future.successful(NotFound(notFoundPage()))
      }
  }
}
