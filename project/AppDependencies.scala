import play.core.PlayVersion.current
import sbt._

object AppDependencies {

  val compile = Seq(
    "uk.gov.hmrc" %% "bootstrap-play-26"   % "1.7.0",
    "uk.gov.hmrc" %% "play-frontend-govuk" % "0.45.0-play-26",
    "uk.gov.hmrc" %% "play-frontend-hmrc"  % "0.15.0-play-26"
  )

  val test = Seq(
    "uk.gov.hmrc"            %% "bootstrap-play-26"  % "1.5.0"  % Test classifier "tests",
    "org.jsoup"              % "jsoup"               % "1.10.2" % "test",
    "com.typesafe.play"      %% "play-test"          % current  % "test",
    "org.pegdown"            % "pegdown"             % "1.6.0"  % "test",
    "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2"  % "it,test",
    "org.scalatest"          %% "scalatest"          % "3.0.7"  % "it,test",
    "uk.gov.hmrc"            %% "webdriver-factory"  % "0.11.0" % "it,test",
    "uk.gov.hmrc"            %% "zap-automation"     % "2.6.0"  % "it,test",
    "com.typesafe"           % "config"              % "1.3.2"  % "it,test"
  )
}
