import sbt._

object AppDependencies {

  private val bootstrapVersion = "7.22.0"

  val compile = Seq(
    "uk.gov.hmrc" %% "bootstrap-frontend-play-28" % bootstrapVersion,
    "uk.gov.hmrc" %% "play-frontend-hmrc"         % "7.23.0-play-28"
  )

  val test = Seq(
    "org.jsoup"               % "jsoup"                  % "1.10.2"         % "test",
    "uk.gov.hmrc"            %% "bootstrap-test-play-28" % bootstrapVersion % "test",
    "com.vladsch.flexmark"    % "flexmark-all"           % "0.62.2"         % "test",
    "org.scalatest"          %% "scalatest"              % "3.2.13"         % "test",
    "org.scalatestplus.play" %% "scalatestplus-play"     % "5.1.0"          % "test",
    "org.scalatestplus"      %% "selenium-4-2"           % "3.2.13.0"       % "test",
    "uk.gov.hmrc"            %% "webdriver-factory"      % "0.41.0"         % "test",
    "com.typesafe"            % "config"                 % "1.4.2"          % "test",
    "com.github.tomakehurst"  % "wiremock-jre8"          % "2.27.2"         % "test"
  )
}
