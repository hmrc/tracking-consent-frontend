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

package unit.views

import play.api.Application
import play.api.i18n.{DefaultMessagesApi, Messages}
import play.api.inject.guice.GuiceApplicationBuilder
import uk.gov.hmrc.govukfrontend.views.viewmodels.footer.FooterItem
import uk.gov.hmrc.trackingconsentfrontend.views.components.FooterLinks
import unit.SpecBase

class FooterLinksSpec extends SpecBase {

  override def fakeApplication(): Application = {
    GuiceApplicationBuilder().configure(Map("footerLinkItems" -> Seq("one", "two", "three"))).build()
  }

  "FooterLinks" must {
    "Return the correct links for the item keys defined" in {
      val testMessages = Map(
        "default" -> Map(
          "footer.one.text" -> "One",
          "footer.one.url" -> "https://one",
          "footer.two.text" -> "Two",
          "footer.two.url" -> "https://two",
          "footer.three.text" -> "Three",
          "footer.three.url" -> "https://three"
        )
      )
      val messagesApi = new DefaultMessagesApi(testMessages)

      implicit val messages: Messages = messagesApi.preferred(fakeRequest)

      FooterLinks() mustBe Seq(
        FooterItem(
          Some("One"),
          Some("https://one")
        ),
        FooterItem(
          Some("Two"),
          Some("https://two")
        ),
        FooterItem(
          Some("Three"),
          Some("https://three")
        )
      )
    }

    "Exclude links where the footer text is undefined" in {
      val messagesApi = new DefaultMessagesApi(Map(
        "default" -> Map(
          "another.message.key" -> "Another Message"
        )
      ))

      implicit val messages: Messages = messagesApi.preferred(fakeRequest)

      FooterLinks() mustBe Seq()
    }

    "Exclude links where the footer url is undefined" in {
      val messagesApi = new DefaultMessagesApi(Map(
        "default" -> Map(
          "footer.cookies.text" -> "abc"
        )
      ))

      implicit val messages: Messages = messagesApi.preferred(fakeRequest)

      FooterLinks() mustBe Seq()
    }

    "Exclude links where the footer url is an empty string" in {
      val messagesApi = new DefaultMessagesApi(Map(
        "default" -> Map(
          "footer.cookies.text" -> "Text",
          "footer.cookies.url" -> ""
        )
      ))

      implicit val messages: Messages = messagesApi.preferred(fakeRequest)

      FooterLinks() mustBe Seq()
    }
  }
}
