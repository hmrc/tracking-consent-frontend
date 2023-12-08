import sbt._

object AppDependencies {

  private val bootstrapVersion = "8.1.0"
  private val frontendVersion  = "8.1.0"
  private val playVersion      = "play-28"

  val compile = Seq(
    "uk.gov.hmrc" %% s"bootstrap-frontend-$playVersion" % bootstrapVersion,
    "uk.gov.hmrc" %% s"play-frontend-hmrc-$playVersion" % frontendVersion
  )

  val test = Seq(
    "uk.gov.hmrc"         %% s"bootstrap-test-$playVersion" % bootstrapVersion % "test",
    "org.scalatestplus"   %% "selenium-4-2"                 % "3.2.13.0"       % "test",
    "uk.gov.hmrc"         %% "webdriver-factory"            % "0.41.0"         % "test",
    "com.typesafe"         % "config"                       % "1.4.2"          % "test",
    "com.vladsch.flexmark" % "flexmark-all"                 % "0.62.2"         % "test",
    "org.jsoup"            % "jsoup"                        % "1.10.2"         % "test"
  )
}
