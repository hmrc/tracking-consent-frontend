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

import acceptance.driver.BrowserDriver
import org.openqa.selenium.{By, Cookie, WebElement}
import org.scalatest.Matchers
import org.scalatestplus.selenium.{Page, WebBrowser}

trait BasePage extends Matchers with Page with WebBrowser with BrowserDriver {
  val url: String

  def userConsentCookie: Cookie = driver.manage().getCookieNamed("userConsent")

  def windowLoadedGtmEvent: AnyRef = findDataLayerEvent("gtm.load")

  def measurementAllowedGtmEvent: AnyRef = findDataLayerEvent("hmrc-measurement-allowed")

  def marketingAllowedGtmEvent: AnyRef = findDataLayerEvent("hmrc-marketing-allowed")

  def settingsAllowedGtmEvent: AnyRef = findDataLayerEvent("hmrc-settings-allowed")

  def h1Element: WebElement = findBy(By.cssSelector("h1"))
}
