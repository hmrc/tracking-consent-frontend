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

package support

import org.scalatest.TestSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder

trait WithConfiguredApp extends TestSuite {
  def appWithConfiguration(configuration: Map[String, Any]): Application = {
    val sharedConfiguration = Map(
      "metrics.enabled"  -> false,
      "auditing.enabled" -> false
    )
    new GuiceApplicationBuilder()
      .configure(sharedConfiguration ++ configuration)
      .disable[com.kenshoo.play.metrics.PlayModule]
      .build()
  }
}
