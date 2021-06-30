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

package acceptance.pages

import acceptance.driver.BrowserDriver
import org.openqa.selenium.{By, Cookie, WebElement}
import org.scalatest.Matchers
import org.scalatestplus.selenium.{Page, WebBrowser}
import java.util.logging.Level.SEVERE

import scala.collection.JavaConverters._

trait BasePage extends Matchers with Page with WebBrowser with BrowserDriver {
  val url: String

  def userConsentCookie: Cookie = driver.manage().getCookieNamed("userConsent")

  def windowLoadedGtmEvent: AnyRef = findDataLayerEvent("gtm.load")

  def optimizelyOptOutEvent: AnyRef = findOptimizelyOptOutEvent(true)

  def optimizelyOptInEvent: AnyRef = findOptimizelyOptOutEvent(false)

  def measurementAllowedGtmEvent: AnyRef = findDataLayerEvent("trackingConsentMeasurementAccepted")

  def settingsAllowedGtmEvent: AnyRef = findDataLayerEvent("trackingConsentSettingsAccepted")

  def h1Element: WebElement = findBy(By.cssSelector("h1"))

  def h3Element: WebElement = findBy(By.cssSelector("h3"))

  def confirmationMessageBanner: WebElement = findBy(By.cssSelector("h2.govuk-notification-banner__title"))

  def consoleErrors: Seq[String] = {
    val logs = driver.manage().logs().get("browser").asScala
    logs.filter(_.getLevel == SEVERE).map(_.getMessage).toSeq
  }
}
