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

object CookieSettingsPage extends BasePage {
  val url: String = TestConfiguration.url("tracking-consent-frontend") + "/cookie-settings"

  val useMeasurementCookies                  = "Use cookies that measure my website use"
  def useMeasurementCookiesLabel: WebElement = findLabelByPartialText(useMeasurementCookies)
  def useMeasurementCookiesInput: WebElement = findInputByLabelPartialText(useMeasurementCookies)

  val doNotUseMeasurementCookies                  = "Do not use cookies that measure my website use"
  def doNotUseMeasurementCookiesLabel: WebElement = findLabelByPartialText(doNotUseMeasurementCookies)
  def doNotUseMeasurementCookiesInput: WebElement = findInputByLabelPartialText(doNotUseMeasurementCookies)

  val useSettingsCookies                  = "Use cookies that remember my settings on services"
  def useSettingsCookiesLabel: WebElement = findLabelByPartialText(useSettingsCookies)
  def useSettingsCookiesInput: WebElement = findInputByLabelPartialText(useSettingsCookies)

  val doNotUseSettingsCookies                  = "Do not use cookies that remember my settings on services"
  def doNotUseSettingsCookiesLabel: WebElement = findLabelByPartialText(doNotUseSettingsCookies)
  def doNotUseSettingsCookiesInput: WebElement = findInputByLabelPartialText(doNotUseSettingsCookies)

  def submitButton: WebElement      = findButtonByPartialText("Save changes")
  def welshSubmitButton: WebElement = findButtonByPartialText("Cadw newidiadau")
}
