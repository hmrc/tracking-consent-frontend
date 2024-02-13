import sbt._

object AppDependencies {

  private val bootstrapVersion = "8.1.0"
  private val frontendVersion  = "8.5.0"
  private val playVersion      = "play-30"

  val compile = Seq(
    "uk.gov.hmrc" %% s"bootstrap-frontend-$playVersion" % bootstrapVersion,
    "uk.gov.hmrc" %% s"play-frontend-hmrc-$playVersion" % frontendVersion
  )

  val test = Seq(
    "org.jsoup"          % "jsoup"                        % "1.15.4"         % Test,
    "uk.gov.hmrc"       %% s"bootstrap-test-$playVersion" % bootstrapVersion % Test,
    "org.scalatestplus" %% "selenium-4-2"                 % "3.2.13.0"       % Test,
    "uk.gov.hmrc"       %% "webdriver-factory"            % "0.46.0"         % Test
  )
}
