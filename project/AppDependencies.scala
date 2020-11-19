import play.core.PlayVersion.current
import sbt._

object AppDependencies {

  val compile = Seq(
    "uk.gov.hmrc" %% "bootstrap-frontend-play-27" % "2.25.0",
    "uk.gov.hmrc" %% "play-frontend-govuk"        % "0.53.0-play-27",
    "uk.gov.hmrc" %% "play-frontend-hmrc"         % "0.26.0-play-27",
    "uk.gov.hmrc" %% "play-language"              % "4.4.0-play-27"
  )

  val test = Seq(
    "org.jsoup"               % "jsoup"              % "1.10.2" % "test",
    "com.typesafe.play"      %% "play-test"          % current  % "test",
    "org.pegdown"             % "pegdown"            % "1.6.0"  % "test",
    "org.scalatest"          %% "scalatest"          % "3.0.8"  % "test",
    "org.scalatestplus.play" %% "scalatestplus-play" % "4.0.3"  % "test",
    "uk.gov.hmrc"            %% "webdriver-factory"  % "0.12.0" % "test",
    "uk.gov.hmrc"            %% "zap-automation"     % "2.7.0"  % "test",
    "com.typesafe"            % "config"             % "1.3.2"  % "test",
    "com.github.tomakehurst"  % "wiremock-jre8"      % "2.21.0" % "test"
  )
}
