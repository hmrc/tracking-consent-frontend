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

import java.io.{File, PrintWriter}
import scala.sys.process.Process

trait AccessibilityMatchers {
  private def createContentFile(content: String): File = {
    val file   = File.createTempFile("input-", ".html");
    val writer = new PrintWriter(file)
    try writer.print(content)
    finally writer.close()
    file
  }

  private def process(args: String*): Int =
    Process(args.toList, new File("test/resources/accessibility")).run().exitValue()

  class HaveNoAxeViolationsMatcher extends Matcher[Html] {
    def apply(left: Html) = {
      val outputCode = process("node", "axe", createContentFile(left.toString).toPath.toString)

      MatchResult(
        outputCode == 0,
        s"""Axe tests failed""",
        s"""Axe tests succeeded"""
      )
    }
  }

  class HaveNoVnuViolationsMatcher extends Matcher[Html] {
    def apply(left: Html) = {
      val outputCode = process("node", "vnu", createContentFile(left.toString).toPath.toString)

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
