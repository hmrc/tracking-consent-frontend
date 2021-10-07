import sbt._

object AppDependencies {

  val compile = Seq(
    "uk.gov.hmrc" %% "bootstrap-frontend-play-28" % "5.14.0",
    "uk.gov.hmrc" %% "play-frontend-hmrc"         % "1.19.0-play-28"
  )

  val test = Seq(
    "uk.gov.hmrc"            %% "bootstrap-test-play-28" % "5.14.0"  % "test",
    "uk.gov.hmrc"            %% "webdriver-factory"      % "0.23.0"  % "test",
    "org.jsoup"               % "jsoup"                  % "1.10.2"  % "test",
    "com.vladsch.flexmark"    % "flexmark-all"           % "0.35.10" % "test",
    "org.scalatest"          %% "scalatest"              % "3.2.9"   % "test",
    "org.scalatestplus.play" %% "scalatestplus-play"     % "5.1.0"   % "test",
    "org.scalatestplus"      %% "selenium-3-141"         % "3.2.9.0" % "test",
    "com.typesafe"            % "config"                 % "1.3.2"   % "test",
    "com.github.tomakehurst"  % "wiremock-jre8"          % "2.21.0"  % "test"
  )
}
