import JavaScriptBuild.*
import play.sbt.PlayImport.PlayKeys.playDefaultPort
import sbt.Keys.testOptions
import uk.gov.hmrc.DefaultBuildSettings
import uk.gov.hmrc.DefaultBuildSettings.addTestReportOption

val appName = "tracking-consent-frontend"

lazy val unitTestSettings =
  inConfig(Test)(Defaults.testTasks) ++
    Seq(
      Test / testOptions := Seq(Tests.Filter(_ startsWith "unit")),
      addTestReportOption(Test, "test-reports")
    )

lazy val sharedSettings = Seq(
  libraryDependencies ++= AppDependencies.compile ++ AppDependencies.test,
  majorVersion := 1,
  scalaVersion := "3.3.3"
)

lazy val microservice = Project(appName, file("."))
  .enablePlugins(play.sbt.PlayScala, SbtDistributablesPlugin)
  .disablePlugins(JUnitXmlReportPlugin) // Required to prevent https://github.com/scalatest/scalatest/issues/1427
  .settings(
    sharedSettings,
    playDefaultPort := 12345,
    resolvers += Resolver.jcenterRepo,
    TwirlKeys.templateImports ++= Seq(
      "views.html.helper.CSPNonce",
      "uk.gov.hmrc.trackingconsentfrontend.config.AppConfig",
      "uk.gov.hmrc.trackingconsentfrontend.views.html.components.*",
      "uk.gov.hmrc.govukfrontend.views.html.components.*",
      "uk.gov.hmrc.hmrcfrontend.views.html.components.*",
      "uk.gov.hmrc.hmrcfrontend.views.html.helpers.*"
    ),
    PlayKeys.playRunHooks += Webpack(baseDirectory.value),
    PlayKeys.devSettings ++= Seq("metrics.enabled" -> "false"),
    Assets / pipelineStages := Seq(gzip),
    unitTestSettings,
    javaScriptSettings,
    scalacOptions += "-Wconf:src=routes/.*:s",
    scalacOptions += "-Wconf:cat=unused-imports&src=html/.*:s"
  )

lazy val it = project
  .enablePlugins(PlayScala)
  .dependsOn(microservice % "test->test")
  .settings(DefaultBuildSettings.itSettings())
  .settings(sharedSettings)
  .settings(
    (Test / managedClasspath) += (microservice / Assets / packageBin).value,
    (Test / test) := (Test / test).dependsOn(microservice / npmBuild).value
  )
