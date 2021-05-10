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

package support

import org.scalatest.matchers._
import play.api.libs.json.{JsArray, Json}
import play.twirl.api.Html

import java.io.{ByteArrayInputStream, File}
import scala.sys.process.Process
import scala.sys.process._

trait AccessibilityMatchers {
  private def process(command: String): ProcessBuilder =
    Process(s"node $command", new File("test/resources/accessibility"))

  private def stream(content: Html) = new ByteArrayInputStream(content.toString.getBytes("UTF-8"))

  class HaveNoAccessibilityViolationsMatcher extends Matcher[Html] {
    def apply(left: Html): MatchResult = {
      val vnuOut = new StringBuilder
      val vnuErr = new StringBuilder
      val axeOut = new StringBuilder
      val axeErr = new StringBuilder

      (process("axe") #< stream(left)) ! ProcessLogger(axeOut append _, axeErr append _)
      (process("vnu") #< stream(left)) ! ProcessLogger(vnuOut append _, vnuErr append _)

      val axeViolations = Json.parse(axeOut.mkString).as[JsArray].value
      val vnuViolations = Json.parse(vnuOut.mkString).as[JsArray].value

      MatchResult(
        axeViolations.isEmpty && vnuViolations.isEmpty,
        s"Axe tests failed:\n$axeOut\nVNU tests failed:\n$vnuOut",
        s"""Accessibility tests succeeded"""
      )
    }
  }

  def haveNoAccessibilityViolations = new HaveNoAccessibilityViolationsMatcher
}

object AccessibilityMatchers extends AccessibilityMatchers
