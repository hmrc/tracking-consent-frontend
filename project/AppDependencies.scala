import play.core.PlayVersion.current
import sbt._

object AppDependencies {

  val compile = Seq(
    "uk.gov.hmrc" %% "bootstrap-frontend-play-28" % "5.3.0",
    "uk.gov.hmrc" %% "play-frontend-hmrc"         % "0.63.0-play-28"
  )

  val test = Seq(
    "org.jsoup"               % "jsoup"                  % "1.10.2" % "test",
    "uk.gov.hmrc"            %% "bootstrap-test-play-28" % "5.3.0"  % "test",
    "org.pegdown"             % "pegdown"                % "1.6.0"  % "test",
    "org.scalatest"          %% "scalatest"              % "3.0.9"  % "test",
    "org.scalatestplus.play" %% "scalatestplus-play"     % "5.0.0"  % "test",
    "uk.gov.hmrc"            %% "webdriver-factory"      % "0.16.0" % "test",
    "com.typesafe"            % "config"                 % "1.3.2"  % "test",
    "com.github.tomakehurst"  % "wiremock-jre8"          % "2.21.0" % "test"
  )
}
