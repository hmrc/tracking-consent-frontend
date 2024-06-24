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

package uk.gov.hmrc.trackingconsentfrontend.config

import javax.inject.{Inject, Singleton}
import play.api.Configuration
import uk.gov.hmrc.play.bootstrap.config.ServicesConfig

@Singleton
class AppConfig @Inject() (config: Configuration, servicesConfig: ServicesConfig) {
  private def getServiceHost(platformHost: Option[String], localConfigKey: String): String =
    platformHost match {
      // if on a environment with Platform host set, use relative URLs (for other tax domains e.g. Developer Hub)
      case Some(host) => ""
      case _          => config.getOptional[String](localConfigKey).getOrElse("")
    }

  val optimizelyUrl: Option[String] =
    for {
      baseUrl   <- config.getOptional[String]("optimizely.url")
      projectId <- config.getOptional[String]("optimizely.projectId")
    } yield s"$baseUrl$projectId.js"

  private val platformHost: Option[String] =
    config.getOptional[String]("platform.frontend.host")

  private val trackingConsentFrontendHost: String =
    getServiceHost(platformHost, "tracking-consent-frontend.base-url-local-testing")

  private val trackingJsPath =
    config.get[String]("tracking-consent-frontend.path")

  val trackingConsentUrl: String =
    s"$trackingConsentFrontendHost$trackingJsPath"

  private val helpFrontendHost: String =
    getServiceHost(platformHost, "help-frontend.base-url-local-testing")

  private val cookieDetailsPath: String =
    config.get[String]("help-frontend.cookie-details-path")

  val cookieDetailsUrl: String =
    s"$helpFrontendHost$cookieDetailsPath"
}
