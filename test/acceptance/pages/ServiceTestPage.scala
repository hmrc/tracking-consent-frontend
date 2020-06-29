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

package acceptance.pages

import org.openqa.selenium.WebElement
import support.TestConfiguration

trait ServiceTestPage extends BasePage {
  val url: String
  val title                = "Service test page"
  val acceptAllCookies     = "Accept all cookies"
  val setCookiePreferences = "Set cookie preferences"

  def acceptAllCookiesButton: WebElement     = findButtonByPartialText(acceptAllCookies)
  def setCookiePreferencesButton: WebElement = findLabelByPartialText(setCookiePreferences)
}

object ServiceTestPageFeatureEnabled extends ServiceTestPage {
  val url: String =
    TestConfiguration.url("tracking-consent-frontend") + "/test-only" + "?featureTrackingConsent=true"
}

object ServiceTestPageFeatureDisabled extends ServiceTestPage {
  val url: String =
    TestConfiguration.url("tracking-consent-frontend") + "/test-only"
}