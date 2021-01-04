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

package unit.testonly.controllers

import play.api.http.Status
import play.api.test.Helpers._
import uk.gov.hmrc.trackingconsentfrontend.testonly.controllers.TestController
import unit.SpecBase

class TestControllerSpec extends SpecBase {
  private val controller = app.injector.instanceOf[TestController]

  "test" should {
    "return 200" in {
      val result = controller.test(fakeRequest)
      status(result) mustBe Status.OK
    }

    "return HTML" in {
      val result = controller.test(fakeRequest)
      contentType(result) mustBe Some("text/html")
      charset(result) mustBe Some("utf-8")
    }

    "show the correct title" in {
      val result = controller.test(fakeRequest)
      contentAsString(result) must include("Service test page")
    }
  }
}
