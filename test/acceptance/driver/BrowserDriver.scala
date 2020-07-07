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

package acceptance.driver

import com.typesafe.scalalogging.LazyLogging
import org.openqa.selenium.{By, JavascriptExecutor, WebDriver, WebElement}
import uk.gov.hmrc.webdriver.SingletonDriver

trait BrowserDriver extends LazyLogging {
  logger.info(
    s"Instantiating Browser: ${sys.props.getOrElse("browser", "'browser' System property not set. This is required")}")

  implicit lazy val driver: WebDriver = SingletonDriver.getInstance()

  def findBy(by: By): WebElement = driver.findElement(by)

  def findLabelByPartialText(partialText: String): WebElement =
    findBy(By.xpath(s"""//label[contains(text(),'$partialText')]"""))

  def findInputByLabelPartialText(partialText: String): WebElement =
    findBy(By.xpath(s"""//input[@id=(//label[contains(text(), '$partialText')]/@for)]"""))

  def findButtonByPartialText(partialText: String): WebElement =
    findBy(By.xpath(s"""//button[contains(text(),'$partialText')]"""))

  def findGtmScript(containerId: String): WebElement =
    findBy(By.cssSelector(s"""script[src*="gtm.js?id=$containerId"]"""))

  def findDataLayerEvent(event: String): AnyRef =
    driver
      .asInstanceOf[JavascriptExecutor]
      .executeScript("return window.dataLayer.find(({event}) => event === arguments[0])", event)
}
