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

package acceptance.pages

import org.openqa.selenium.WebElement
import support.TestConfiguration

object ServiceTestPage extends BasePage {
  val url: String =
    TestConfiguration.url("tracking-consent-frontend") + "/test-only"

  val title                   = "Service test page"
  val acceptAdditionalCookies = "Accept additional cookies"
  val rejectAdditionalCookies = "Reject additional cookies"
  val setCookiePreferences    = "View cookies"

  def acceptAdditionalCookiesButton: WebElement = findButtonByPartialText(acceptAdditionalCookies)
  def rejectAdditionalCookiesButton: WebElement = findButtonByPartialText(rejectAdditionalCookies)
  def setCookiePreferencesButton: WebElement    = findLabelByPartialText(setCookiePreferences)
}
