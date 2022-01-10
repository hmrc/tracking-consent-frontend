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

package unit.config

import play.api.test.Helpers._
import uk.gov.hmrc.trackingconsentfrontend.config.ErrorHandler
import unit.SpecBase

class ErrorHandlerSpec extends SpecBase {
  private val errorHandler = app.injector.instanceOf[ErrorHandler]

  "standardErrorTemplate" should {
    "show the correct title" in {
      val result =
        errorHandler.standardErrorTemplate(pageTitle = "Error occurred", heading = "A heading", message = "A message")(
          fakeRequest
        )
      contentAsString(result) must include("A heading")
    }
  }
}
