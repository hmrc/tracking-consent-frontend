/*
 * Copyright 2025 HM Revenue & Customs
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

package uk.gov.hmrc.trackingconsentfrontend.filters

import play.api.mvc._
import javax.inject.Inject
import scala.concurrent.ExecutionContext

class CookieConsentFilter @Inject() (implicit ec: ExecutionContext) extends EssentialFilter {
  private val yearInSeconds = 31556926

  // This filter is not intended to stay forever, but rather to alleviate an issue with a bug, as per PLATUI-3509
  override def apply(next: EssentialAction): EssentialAction = EssentialAction { requestHeader =>
    next(requestHeader).map { result =>
      val modifiedCookies =
        requestHeader.cookies.withFilter(c => c.name == "userConsent" || c.name == "mdtpurr").map { c =>
          if (c.httpOnly) c.copy(httpOnly = false, maxAge = c.maxAge.orElse(Some(yearInSeconds)))
          else c
        }

      result.withCookies(modifiedCookies.toSeq: _*)
    }
  }
}
