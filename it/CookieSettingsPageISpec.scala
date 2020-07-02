import org.scalatest.{Matchers, WordSpecLike}
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.test.FakeRequest
import play.api.test.Helpers.{GET, route, _}

class CookieSettingsPageISpec extends WordSpecLike with Matchers with GuiceOneAppPerSuite {

  override lazy val app: Application = new GuiceApplicationBuilder()
    .configure(
      Map(
        "metrics.enabled"  -> false,
        "auditing.enabled" -> false
      )
    )
    .disable[com.kenshoo.play.metrics.PlayModule]
    .build()

  "Given a running instance of tracking consent frontend, calling GET for cookie-settings" should {
    "return OK with expected page" in {
      val request = FakeRequest(GET, "/tracking-consent/cookie-settings")
      val result = route(app, request).get

      status(result) shouldBe 200
      contentType(result) shouldBe Some("text/html")
      contentAsString(result) should include("Cookie settings on HMRC services")
    }
  }
}
