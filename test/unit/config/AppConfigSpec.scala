/*
 * Copyright 2024 HM Revenue & Customs
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

package unit.config

import play.api.Configuration
import uk.gov.hmrc.play.bootstrap.config.ServicesConfig
import uk.gov.hmrc.trackingconsentfrontend.config.AppConfig
import unit.SpecBase

class AppConfigSpec extends SpecBase {
  val baseConfigMap = Map(
    "tracking-consent-frontend.path"    -> "/tracking-consent/tracking.js",
    "help-frontend.cookie-details-path" -> "/help/cookie-settings"
  )

  "cookieDetailsUrl" should {
    "return a relative URL if the Platform host is set" in {
      val config        = Configuration.from(
        baseConfigMap ++ Map(
          "platform.frontend.host"               -> "www.staging.tax.service.gov.uk",
          "help-frontend.base-url-local-testing" -> "http://localhost:9240"
        )
      )
      val serviceConfig = new ServicesConfig(config)
      val appConfig     = AppConfig(config, serviceConfig)
      appConfig.cookieDetailsUrl must be("/help/cookie-settings")
    }

    "return using the local host if Platform host not set" in {
      val config        = Configuration.from(
        baseConfigMap ++ Map(
          "help-frontend.base-url-local-testing" -> "http://localhost:9240"
        )
      )
      val serviceConfig = new ServicesConfig(config)
      val appConfig     = AppConfig(config, serviceConfig)
      appConfig.cookieDetailsUrl must be("http://localhost:9240/help/cookie-settings")
    }

    "return using the relative path if both local host and Platform host are not set" in {
      val config        = Configuration.from(baseConfigMap)
      val serviceConfig = new ServicesConfig(config)
      val appConfig     = AppConfig(config, serviceConfig)
      appConfig.cookieDetailsUrl must be("/help/cookie-settings")
    }
  }

}
