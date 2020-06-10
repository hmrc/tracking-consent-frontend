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

package acceptance

import java.net.{HttpURLConnection, URL}

import org.scalatest.{BeforeAndAfterAll, Matchers, TryValues, WordSpec}
import support.TestServer
import support.TestConfiguration.env
import scala.util.Try

class TestServerSpec extends WordSpec with TestServer with Matchers with TryValues with BeforeAndAfterAll {
  override lazy val port = 6001

  val url = new URL(s"http://localhost:$port/tracking-consent/cookie-settings")
  val expectedFailureMessage = "Connection refused (Connection refused)"

  private def getTestPageResponseCode = {
    val con = url.openConnection().asInstanceOf[HttpURLConnection]

    try con.getResponseCode finally con.disconnect()
  }

  override def beforeAll() {
    val connectionTry = Try { getTestPageResponseCode }

    connectionTry.failure.exception should have message expectedFailureMessage
  }

  override def afterAll() {
    val connectionTry = Try { getTestPageResponseCode }

    connectionTry.failure.exception should have message expectedFailureMessage
  }

  "TestServer" should {
    "create an HTTP endpoint if running locally" in {
      val connectionTry = Try {
        getTestPageResponseCode
      }

      if (env == "local") {
        connectionTry.success.value should be(200)
      }
    }

    "not create an HTTP endpoint if not running locally" in {
      val connectionTry = Try {
        getTestPageResponseCode
      }

      if (env != "local") {
        connectionTry.failure.exception should have message expectedFailureMessage
      }
    }
  }
}
