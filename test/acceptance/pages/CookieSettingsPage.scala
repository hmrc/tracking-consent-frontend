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

import acceptance.pages.ServiceTestPage.get
import org.openqa.selenium.By
import uk.gov.hmrc.selenium.webdriver.Driver
import support.TestConfiguration
import uk.gov.hmrc.selenium.component.PageObject

object CookieSettingsPage extends PageObject {
  private val url: String = TestConfiguration.url("tracking-consent-frontend") + "/cookie-settings"

  def goToCookieSettingsPage(): Unit = get(url)

  def deleteAllCookies(): Unit = Driver.instance.manage().deleteAllCookies()

  def labelByPartialText(partialText: String): By =
    By.xpath(s"""//label[contains(text(),'$partialText')]""")

  def inputByLabelPartialText(partialText: String): By =
    By.xpath(s"""//input[@id=(//label[contains(text(), '$partialText')]/@for)]""")

  def clickUseMeasurementCookies(): Unit = click(labelByPartialText("Use cookies that measure my website use"))

  def clickDoNotUseMeasurementCookies(): Unit = click(
    labelByPartialText("Do not use cookies that measure my website use")
  )

  def clickUseSettingsCookies(): Unit = click(labelByPartialText("Use cookies that remember my settings on services"))

  def clickDoNotUseSettingsCookies(): Unit = click(
    labelByPartialText("Do not use cookies that remember my settings on services")
  )

  def clickSubmitButton(): Unit = click(By.xpath(s"""//button[contains(text(),'Save changes')]"""))
}
