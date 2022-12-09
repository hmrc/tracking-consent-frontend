/*
 * Copyright 2022 HM Revenue & Customs
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

package acceptance.specs

import acceptance.driver.BrowserDriver
import org.scalatest.concurrent.{Eventually, IntegrationPatience}
import org.scalatest.{BeforeAndAfterAll, GivenWhenThen, Outcome, Retries}
import org.scalatest.matchers.should.Matchers
import org.scalatest.featurespec.AnyFeatureSpec
import org.scalatest.time.{Seconds, Span}
import org.scalatestplus.selenium.WebBrowser
import support.AcceptanceTestServer
import uk.gov.hmrc.scalatestaccessibilitylinter.AccessibilityMatchers
import uk.gov.hmrc.webdriver.SingletonDriver

import scala.util.Try

trait BaseAcceptanceSpec
    extends AnyFeatureSpec
    with GivenWhenThen
    with BeforeAndAfterAll
    with Matchers
    with WebBrowser
    with AcceptanceTestServer
    with BrowserDriver
    with Retries
    with Eventually
    with IntegrationPatience
    with AccessibilityMatchers {

  override def beforeAll(): Unit = {
    // Ensures the browser is quit only when the JVM exits
    // Previously this was accomplished via a call to SingletonDriver.quit()
    // in a afterAll but this resulted in a race-condition
    // with the driver left in an inconsistent state resulting in
    // session not found
    super.beforeAll()
    sys.addShutdownHook {
      Try(SingletonDriver.closeInstance())
    }
  }

  override def withFixture(test: NoArgTest): Outcome =
    if (isRetryable(test))
      withRetry(Span(2L, Seconds))(super.withFixture(test))
    else
      super.withFixture(test)
}
