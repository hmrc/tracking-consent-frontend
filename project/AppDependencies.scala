import sbt.*

object AppDependencies {

  private val bootstrapVersion = "10.5.0"
  private val frontendVersion  = "12.31.0"
  private val playVersion      = "play-30"

  val compile = Seq(
    "uk.gov.hmrc" %% s"bootstrap-frontend-$playVersion" % bootstrapVersion,
    "uk.gov.hmrc" %% s"play-frontend-hmrc-$playVersion" % frontendVersion
  )

  val test = Seq(
    "org.jsoup"          % "jsoup"                        % "1.18.3"         % Test,
    "uk.gov.hmrc"       %% s"bootstrap-test-$playVersion" % bootstrapVersion % Test,
    "org.scalatestplus" %% "selenium-4-21"                % "3.2.19.0"       % Test,
    "uk.gov.hmrc"       %% "ui-test-runner"               % "0.52.0"         % Test
  )
}
