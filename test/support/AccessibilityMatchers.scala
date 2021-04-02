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
import play.twirl.api.Html

import java.io.{ByteArrayInputStream, File}
import scala.sys.process.Process
import scala.sys.process._

trait AccessibilityMatchers {
  private def process(command: String): ProcessBuilder =
    Process(s"node $command", new File("test/resources/accessibility"))

  private def stream(content: Html) = new ByteArrayInputStream(content.toString.getBytes("UTF-8"))

  class HaveNoAxeViolationsMatcher extends Matcher[Html] {
    def apply(left: Html): MatchResult = {
      val outputCode =
        (process("axe") #< stream(left)) !

      MatchResult(
        outputCode == 0,
        s"""Axe tests failed""",
        s"""Axe tests succeeded"""
      )
    }
  }

  class HaveNoVnuViolationsMatcher extends Matcher[Html] {
    def apply(left: Html): MatchResult = {
      val outputCode = (process("vnu") #< stream(left)) !

      MatchResult(
        outputCode == 0,
        s"""VNU tests failed""",
        s"""VNU tests succeeded"""
      )
    }
  }

  def haveNoAxeViolations = new HaveNoAxeViolationsMatcher

  def haveNoVnuViolations = new HaveNoVnuViolationsMatcher
}

object AccessibilityMatchers extends AccessibilityMatchers
