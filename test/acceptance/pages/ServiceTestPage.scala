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

import org.openqa.selenium.By
import support.TestConfiguration
import uk.gov.hmrc.selenium.component.PageObject
import uk.gov.hmrc.selenium.webdriver.Driver

object ServiceTestPage extends PageObject {
  private val url: String =
    TestConfiguration.url("tracking-consent-frontend") + "/test-only"

  def goToServiceTestPage(): Unit = get(url)

  def deleteAllCookies(): Unit = Driver.instance.manage().deleteAllCookies()

  def clickAcceptAdditionalCookiesButton(): Unit = click(
    By.xpath(s"""//button[contains(text(),'Accept additional cookies')]""")
  )

}
